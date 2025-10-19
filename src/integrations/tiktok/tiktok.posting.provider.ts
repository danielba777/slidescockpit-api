import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { BadBody, RefreshToken, SocialAbstract } from '../social/social.abstract';
import { TikTokAccount } from './tiktok.types';
import { TikTokPostRequestDto, TikTokPostingSettingsDto } from './dto/post-tiktok.dto';

type TikTokPostResult =
  | {
      postId: string;
      releaseUrl?: string;
      status: 'success';
    }
  | {
      postId: string;
      releaseUrl?: string;
      status: 'inbox';
    };

interface TikTokPostStatusSingle {
  status: 'processing' | 'success' | 'failed' | 'inbox';
  id?: string;
  url?: string;
}

interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  scope: string[];
  openId: string | null;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class TikTokPostingProvider extends SocialAbstract {
  protected readonly logger = new Logger(TikTokPostingProvider.name);
  private readonly clientKey = this.requireEnv('TIKTOK_CLIENT_KEY');
  private readonly clientSecret = this.requireEnv('TIKTOK_CLIENT_SECRET');
  private readonly scopes = [
    'user.info.basic',
    'user.info.profile',
    'video.upload',
    'video.publish',
  ];

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    const form = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await this.fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const payload = await response.json().catch(() => undefined);
    if (!response.ok) {
      const message =
        typeof payload?.message === 'string'
          ? payload.message
          : 'Unable to refresh TikTok token';
      throw new RefreshToken(message);
    }

    const data = this.extractDataObject(payload);
    const scope = this.parseScopes(data?.scope ?? payload?.scope ?? []);
    this.checkScopes(this.scopes, scope);

    const accessToken = data?.access_token ?? payload?.access_token;
    const nextRefreshToken = data?.refresh_token ?? payload?.refresh_token ?? refreshToken;

    if (!accessToken) {
      throw new RefreshToken('TikTok refresh did not return an access token');
    }

    const userInfo = await this.fetchUserInfo(accessToken);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      expiresIn: typeof (data?.expires_in ?? payload?.expires_in) === 'number'
        ? (data?.expires_in ?? payload?.expires_in)
        : null,
      refreshExpiresIn:
        typeof (data?.refresh_expires_in ?? payload?.refresh_expires_in) === 'number'
          ? (data?.refresh_expires_in ?? payload?.refresh_expires_in)
          : null,
      scope,
      openId: userInfo.openId,
      displayName: userInfo.displayName,
      username: userInfo.username,
      avatarUrl: userInfo.avatarUrl,
    };
  }

  async post(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<TikTokPostResult> {
    const { publishId } = await this.initPost(account, payload);

    const finalState = await this.uploadedVideoSuccess(
      account.username ?? account.openId,
      publishId,
      account.accessToken,
    );

    if (finalState.status === 'success') {
      return {
        postId: String(finalState.id),
        ...(finalState.url ? { releaseUrl: finalState.url } : {}),
        status: 'success',
      };
    }

    return {
      postId: String(finalState.id ?? publishId),
      status: 'inbox',
      releaseUrl: finalState.url,
    };
  }

  async initPostOnly(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<{ publishId: string }> {
    return this.initPost(account, payload);
  }

  private async initPost(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<{ publishId: string }> {
    this.checkScopes(this.scopes, account.scope ?? []);

    const media = payload.media ?? [];
    if (media.length === 0) {
      throw new BadBody('tiktok-missing-media', 'No media provided for TikTok post');
    }

    const primaryMedia = media[0];
    const isPhoto = primaryMedia.type === 'photo';
    const settings: TikTokPostingSettingsDto = {
      contentPostingMethod: payload.settings?.contentPostingMethod ?? 'UPLOAD',
      privacyLevel: payload.settings?.privacyLevel ?? 'SELF_ONLY',
      duet: payload.settings?.duet ?? false,
      comment: payload.settings?.comment ?? false,
      stitch: payload.settings?.stitch ?? false,
      videoMadeWithAi: payload.settings?.videoMadeWithAi ?? false,
      brandContentToggle: payload.settings?.brandContentToggle ?? false,
      brandOrganicToggle: payload.settings?.brandOrganicToggle ?? false,
      autoAddMusic: payload.settings?.autoAddMusic ?? true,
      title: payload.settings?.title,
    };

    const endpointPath = this.postingMethod(settings.contentPostingMethod ?? 'DIRECT_POST', isPhoto);
    const endpoint = `https://open.tiktokapis.com/v2/post/publish${endpointPath}`;

    const body = this.buildPostBody(
      payload.caption ?? '',
      settings,
      media,
      isPhoto,
      payload.postMode,
    );

    const response = await this.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${account.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const payloadJson = await response.json().catch(() => undefined);
    if (!response.ok || !payloadJson?.data?.publish_id) {
      const serialized = JSON.stringify(payloadJson ?? {});
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      const fallbackMessage =
        handled?.value ??
        this.extractErrorMessage(payloadJson) ??
        'Failed to start TikTok publish flow';
      throw new BadBody(
        'tiktok-post-init-failed',
        serialized,
        Buffer.from(serialized),
        fallbackMessage,
      );
    }

    return { publishId: String(payloadJson.data.publish_id) };
  }

  async fetchPublishStatus(
    profileId: string,
    publishId: string,
    accessToken: string,
  ): Promise<TikTokPostStatusSingle> {
    const response = await this.fetch(
      'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ publish_id: publishId }),
      },
      'tiktok-post-status-once',
    );

    const payload = await response.json().catch(() => undefined);
    this.logger.debug(
      `TikTok fetchPublishStatus response (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
        payload ?? {},
      )}`,
    );
    if (!response.ok || !payload?.data) {
      this.logger.warn(
        `TikTok fetchPublishStatus returned unexpected payload (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
          payload ?? {},
        )}`,
      );
      const serialized = JSON.stringify(payload ?? {});
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      throw new BadBody(
        'tiktok-post-status-failed',
        serialized,
        Buffer.from(serialized),
        handled?.value ?? this.extractErrorMessage(payload) ?? 'Failed to retrieve TikTok publish status',
      );
    }

    const { status, publicly_available_post_id, publicaly_available_post_id } = payload.data;

    if (status === 'PUBLISH_COMPLETE') {
      const postId = publicly_available_post_id?.[0] ?? publicaly_available_post_id?.[0] ?? publishId;
      const url = publicly_available_post_id?.[0]
        ? `https://www.tiktok.com/@${profileId}/video/${publicly_available_post_id[0]}`
        : `https://www.tiktok.com/@${profileId}`;
      return { status: 'success', id: String(postId), url };
    }

    if (status === 'FAILED') {
      const serialized = JSON.stringify(payload);
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      return { status: 'failed' };
    }

    if (status === 'SEND_TO_USER_INBOX') {
      return { status: 'inbox', id: publishId };
    }

    return { status: 'processing' };
  }

  private buildPostBody(
    caption: string,
    settings: TikTokPostingSettingsDto,
    media: TikTokPostRequestDto['media'],
    isPhoto: boolean,
    postMode: TikTokPostRequestDto['postMode'],
  ): Record<string, unknown> {
    const primary = media[0];
    const body: Record<string, unknown> = {};
    const resolvedPostMode = this.resolvePostMode(settings, postMode, isPhoto);

    const titleSource = isPhoto ? settings.title ?? caption : caption;
    const postInfo: Record<string, unknown> = {
      privacy_level: settings.privacyLevel ?? 'SELF_ONLY',
      disable_duet: !(settings.duet ?? false),
      disable_comment: !(settings.comment ?? false),
      disable_stitch: !(settings.stitch ?? false),
      is_aigc: settings.videoMadeWithAi ?? false,
      brand_content_toggle: settings.brandContentToggle ?? false,
      brand_organic_toggle: settings.brandOrganicToggle ?? false,
    };

    if (titleSource && titleSource.length > 0) {
      postInfo.title = titleSource;
    }

    postInfo.description = caption ?? '';

    if (isPhoto && settings.autoAddMusic) {
      postInfo.auto_add_music = true;
    }

    body.post_info = postInfo;

    if (isPhoto) {
      body.source_info = {
        source: 'PULL_FROM_URL',
        photo_cover_index: 0,
        photo_images: media.map((item) => item.url),
      };
    } else {
      const videoInfo: Record<string, unknown> = {
        source: 'PULL_FROM_URL',
        video_url: primary.url,
      };
      if (typeof primary.thumbnailTimestampMs === 'number') {
        videoInfo.video_cover_timestamp_ms = primary.thumbnailTimestampMs;
      }

      body.source_info = videoInfo;
    }

    body.post_mode = resolvedPostMode;
    body.media_type = isPhoto ? 'PHOTO' : 'VIDEO';

    return body;
  }

  private postingMethod(method: TikTokPostingSettingsDto['contentPostingMethod'], isPhoto: boolean): string {
    switch (method) {
      case 'UPLOAD':
      case 'MEDIA_UPLOAD':
        return isPhoto ? '/content/init/' : '/inbox/video/init/';
      case 'URL':
      case 'DIRECT_POST':
      default:
        return isPhoto ? '/content/init/' : '/video/init/';
    }
  }

  private resolvePostMode(
    settings: TikTokPostingSettingsDto,
    requestedPostMode: TikTokPostRequestDto['postMode'],
    isPhoto: boolean,
  ): 'DIRECT_POST' | 'MEDIA_UPLOAD' {
    switch (requestedPostMode) {
      case 'DIRECT_POST':
      case 'MEDIA_UPLOAD':
        return requestedPostMode;
      case 'PUBLISH':
        return 'DIRECT_POST';
      case 'INBOX':
        return 'MEDIA_UPLOAD';
      default:
        break;
    }

    switch (settings.contentPostingMethod) {
      case 'DIRECT_POST':
        return 'DIRECT_POST';
      case 'URL':
        return 'DIRECT_POST';
      case 'UPLOAD':
      case 'MEDIA_UPLOAD':
        return 'MEDIA_UPLOAD';
      default:
        break;
    }

    return isPhoto ? 'MEDIA_UPLOAD' : 'DIRECT_POST';
  }

  private async uploadedVideoSuccess(
    profileId: string,
    publishId: string,
    accessToken: string,
  ): Promise<{ status: 'success'; id: string; url?: string } | { status: 'inbox'; id?: string; url?: string }> {
    const maxAttempts = Number(process.env.TIKTOK_POST_STATUS_ATTEMPTS ?? 30);
    const intervalMs = Number(process.env.TIKTOK_POST_STATUS_INTERVAL_MS ?? 10_000);
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts += 1;

      const response = await this.fetch(
        'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ publish_id: publishId }),
        },
        'tiktok-post-status',
      );

      const payload = await response.json().catch(() => undefined);
      this.logger.debug(
        `TikTok uploadedVideoSuccess attempt ${attempts}/${maxAttempts} (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
          payload ?? {},
        )}`,
      );
      if (!response.ok || !payload?.data) {
        this.logger.warn(
          `TikTok uploadedVideoSuccess received unexpected payload (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
            payload ?? {},
          )}`,
        );
        const serialized = JSON.stringify(payload ?? {});
        const handled = this.handleErrors(serialized);
        if (handled?.type === 'refresh-token') {
          throw new RefreshToken(handled.value);
        }
        throw new BadBody(
          'tiktok-post-status-failed',
          serialized,
          Buffer.from(serialized),
          handled?.value ?? this.extractErrorMessage(payload) ?? 'Failed to retrieve TikTok publish status',
        );
      }

      const { status, publicly_available_post_id, publicaly_available_post_id } = payload.data;

      if (status === 'PUBLISH_COMPLETE') {
        const postId = publicly_available_post_id?.[0] ?? publicaly_available_post_id?.[0] ?? publishId;
        const url = publicly_available_post_id?.[0]
          ? `https://www.tiktok.com/@${profileId}/video/${publicly_available_post_id[0]}`
          : `https://www.tiktok.com/@${profileId}`;

        return {
          status: 'success',
          id: String(postId),
          url,
        };
      }

      if (status === 'FAILED') {
        const serialized = JSON.stringify(payload);
        const handled = this.handleErrors(serialized);
        if (handled?.type === 'refresh-token') {
          throw new RefreshToken(handled.value);
        }
        throw new BadBody(
          'tiktok-post-failed',
          serialized,
          Buffer.from(serialized),
          handled?.value ?? this.extractErrorMessage(payload) ?? 'TikTok marked the publish as failed',
        );
      }

      if (status === 'SEND_TO_USER_INBOX') {
        return {
          status: 'inbox',
          id: publishId,
        };
      }

      await this.sleep(intervalMs);
    }

    throw new BadBody(
      'tiktok-post-status-timeout',
      JSON.stringify({ publishId, attempts: maxAttempts }),
      undefined,
      'TikTok did not finish processing the post in time',
    );
  }

  private handleErrors(body: string):
    | { type: 'refresh-token' | 'bad-body'; value: string }
    | undefined {
    const normalized = body.toLowerCase();

    if (normalized.includes('access_token_invalid')) {
      return {
        type: 'refresh-token',
        value: 'Access token invalid, please re-authenticate your TikTok account',
      };
    }

    if (normalized.includes('scope_not_authorized')) {
      return {
        type: 'refresh-token',
        value: 'Missing required permissions, please re-authorize with TikTok',
      };
    }

    if (normalized.includes('scope_permission_missed')) {
      return {
        type: 'refresh-token',
        value: 'Additional TikTok permissions required, please re-authorize',
      };
    }

    if (normalized.includes('rate_limit_exceeded')) {
      return {
        type: 'bad-body',
        value: 'TikTok API rate limit exceeded, please try again later',
      };
    }

    if (normalized.includes('file_format_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Invalid file format, please check TikTok video specifications',
      };
    }

    if (normalized.includes('duration_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Video duration is invalid for TikTok',
      };
    }

    if (normalized.includes('frame_rate_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Video frame rate is invalid for TikTok',
      };
    }

    if (normalized.includes('video_pull_failed')) {
      return {
        type: 'bad-body',
        value: 'TikTok could not download the video from the provided URL',
      };
    }

    if (normalized.includes('photo_pull_failed')) {
      return {
        type: 'bad-body',
        value: 'TikTok could not download the photo from the provided URL',
      };
    }

    if (normalized.includes('spam_risk')) {
      return {
        type: 'bad-body',
        value: 'TikTok flagged the content as potential spam',
      };
    }

    if (normalized.includes('reached_active_user_cap')) {
      return {
        type: 'bad-body',
        value: 'Daily active user quota reached for TikTok',
      };
    }

    if (normalized.includes('unaudited_client_can_only_post_to_private_accounts')) {
      return {
        type: 'bad-body',
        value: 'TikTok app is not approved for public posting. Contact support.',
      };
    }

    if (normalized.includes('invalid_file_upload') || normalized.includes('invalid_params')) {
      return {
        type: 'bad-body',
        value: 'TikTok rejected the request due to invalid media or parameters',
      };
    }

    if (normalized.includes('internal')) {
      return {
        type: 'bad-body',
        value: 'TikTok servers reported an internal error. Please try again later.',
      };
    }

    return undefined;
  }

  private async fetchUserInfo(accessToken: string) {
    const params = new URLSearchParams({
      fields: 'open_id,display_name,avatar_url,username,union_id',
    });

    const response = await this.fetch(
      `https://open.tiktokapis.com/v2/user/info/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      'tiktok-user-info',
    );

    const payload = await response.json().catch(() => undefined);
    if (!response.ok || !payload?.data?.user) {
      const message =
        typeof payload?.message === 'string'
          ? payload.message
          : 'Unable to fetch TikTok user profile';
      throw new RefreshToken(message);
    }

    const user = payload.data.user;
    const openId = typeof user?.open_id === 'string' ? this.normalizeOpenId(user.open_id) : null;

    return {
      openId,
      displayName: typeof user?.display_name === 'string' ? user.display_name : null,
      username: typeof user?.username === 'string' ? user.username : null,
      avatarUrl: typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    };
  }

  private normalizeOpenId(openId: string | null): string | null {
    if (!openId) {
      return null;
    }
    return openId.replace(/-/g, '').trim();
  }

  private parseScopes(scopeValue: unknown): string[] {
    if (Array.isArray(scopeValue)) {
      return scopeValue
        .map((entry) => (typeof entry === 'string' ? entry : String(entry)))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    if (typeof scopeValue === 'string') {
      return scopeValue
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    return [];
  }

  private extractDataObject(payload: any): any {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const data = (payload as any).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }

    return payload;
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
      throw new InternalServerErrorException(
        `${name} environment variable is not configured`,
      );
    }
    return value;
  }

  private extractErrorMessage(payload: any): string | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (
      typeof payload.error === 'object' &&
      payload.error !== null &&
      typeof payload.error.message === 'string'
    ) {
      return payload.error.message;
    }

    if (
      Array.isArray(payload.errors) &&
      payload.errors.length > 0 &&
      typeof payload.errors[0]?.message === 'string'
    ) {
      return payload.errors[0].message;
    }

    if (
      typeof payload.data === 'object' &&
      payload.data !== null &&
      typeof (payload.data as any).error === 'object' &&
      (payload.data as any).error !== null &&
      typeof (payload.data as any).error.message === 'string'
    ) {
      return (payload.data as any).error.message;
    }

    if (typeof payload.description === 'string' && payload.description.trim().length > 0) {
      return payload.description;
    }

    return undefined;
  }
}
