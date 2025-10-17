import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { ConnectTikTokDto } from './dto/connect-tiktok.dto';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokAccount } from './tiktok.types';

interface OAuthTokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  scope: string[];
  openId: string | null;
}

interface TikTokUserInfo {
  openId: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class TikTokService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly clientKey = this.requireEnv('TIKTOK_CLIENT_KEY');
  private readonly clientSecret = this.requireEnv('TIKTOK_CLIENT_SECRET');
  private readonly redirectUri = this.requireEnv('TIKTOK_REDIRECT_URI');
  private readonly scopes = this.getScopes();
  private readonly forceVerify =
    (process.env.TIKTOK_FORCE_VERIFY ?? 'false').toLowerCase() === 'true';
  private readonly mockMode =
    (process.env.TIKTOK_MOCK ?? 'false').toLowerCase() === 'true';

  constructor(
    private readonly repository: TikTokAccountRepository,
  ) {}

  start(state: string): { url: string } {
    const url = this.buildAuthorizeUrl(state);
    return { url };
  }

  async connect(dto: ConnectTikTokDto): Promise<TikTokAccount> {
    if (this.mockMode) {
      const account = this.buildMockAccount(dto);
      await this.repository.upsertAccount(account);
      return account;
    }

    const token = await this.exchangeCodeForToken(dto.code);
    this.logger.debug?.(
      `TikTok token scopes granted: ${token.scope.join(', ') || '(none)'}`,
    );
    const userInfo = await this.fetchUserInfo(token.accessToken).catch(
      (error: unknown) => {
        const errMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Proceeding without TikTok profile details: ${errMessage}`,
        );
        return {
          openId: token.openId,
          displayName: null,
          avatarUrl: null,
        };
      },
    );

    const now = new Date();
    const timezoneOffsetMinutes = this.parseTimezone(dto.timezone);

    const account: TikTokAccount = {
      openId: userInfo.openId ?? token.openId ?? this.ensureOpenId(token),
      displayName: userInfo.displayName,
      avatarUrl: userInfo.avatarUrl,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: this.calculateExpiry(now, token.expiresIn),
      refreshExpiresAt: this.calculateExpiry(now, token.refreshExpiresIn),
      scope: token.scope,
      timezoneOffsetMinutes,
      connectedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await this.repository.upsertAccount(account);
    return account;
  }

  private async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    }).catch((error: unknown) => {
      this.logger.error(`Failed to reach TikTok token endpoint`, error as Error);
      throw new BadRequestException('Unable to reach TikTok token endpoint');
    });

    const payload = await this.safeJson(response);
    const data: any = payload?.data ?? payload;

    if (!response.ok) {
      const message =
        (typeof data === 'object' && data?.message) ||
        (typeof data?.error_msg === 'string' && data.error_msg) ||
        'TikTok token exchange failed';
      throw new BadRequestException(message);
    }

    const scope = Array.isArray(data?.scope)
      ? data.scope
      : typeof data?.scope === 'string'
      ? data.scope.split(',').map((entry: string) => entry.trim()).filter(Boolean)
      : [];

    return {
      accessToken: data?.access_token,
      refreshToken: data?.refresh_token ?? null,
      expiresIn:
        typeof data?.expires_in === 'number' ? data.expires_in : null,
      refreshExpiresIn:
        typeof data?.refresh_expires_in === 'number'
          ? data.refresh_expires_in
          : null,
      scope,
      openId: typeof data?.open_id === 'string' ? data.open_id : null,
    };
  }

  private async fetchUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    const params = new URLSearchParams({
      fields: 'open_id,display_name,avatar_url',
    });

    const response = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).catch((error: unknown) => {
      this.logger.error(`Failed to reach TikTok user info endpoint`, error as Error);
      throw new BadRequestException('Unable to fetch TikTok profile information');
    });

    const payload = await this.safeJson(response);
    const data: any = payload?.data ?? {};
    const user: any = data?.user ?? {};

    if (!response.ok) {
      const message = this.extractErrorMessage(payload) ?? 'TikTok user info retrieval failed';
      this.logger.warn(
        `TikTok user info request failed (status ${response.status}): ${message}`,
      );
      this.logger.debug?.(
        `TikTok user info error payload: ${JSON.stringify(payload)}`,
      );
      throw new BadRequestException(message);
    }

    return {
      openId: typeof user?.open_id === 'string' ? user.open_id : null,
      displayName:
        typeof user?.display_name === 'string' ? user.display_name : null,
      avatarUrl:
        typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    };
  }

  private buildAuthorizeUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: this.scopes,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state,
    });

    if (this.forceVerify) {
      params.set('force_verify', '1');
    }

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  private getScopes(): string {
    const fromEnv = process.env.TIKTOK_SCOPES;
    if (fromEnv && fromEnv.trim().length > 0) {
      return fromEnv
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .join(',');
    }
    return 'user.info.basic,video.list,video.upload';
  }

  private parseTimezone(value?: string): number | null {
    if (!value) {
      return null;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return parsed;
  }

  private calculateExpiry(now: Date, seconds: number | null): string {
    const base = now.getTime();
    const duration = seconds && seconds > 0 ? seconds * 1000 : 3600 * 1000;
    return new Date(base + duration).toISOString();
  }

  private ensureOpenId(token: OAuthTokenResponse): string {
    if (token.openId) {
      return token.openId;
    }

    this.logger.warn(
      `Access token was issued without open_id. Requested scopes: ${token.scope.join(', ')}`,
    );
    throw new InternalServerErrorException(
      'TikTok response did not include an open_id',
    );
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

  private async safeJson(response: globalThis.Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
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
      typeof payload.data === 'object' &&
      payload.data !== null &&
      typeof (payload.data as any).error === 'object' &&
      (payload.data as any).error !== null &&
      typeof (payload.data as any).error.message === 'string'
    ) {
      return (payload.data as any).error.message;
    }

    return undefined;
  }

  private buildMockAccount(dto: ConnectTikTokDto): TikTokAccount {
    const now = new Date();
    const accessToken = `mock_access_${randomBytes(8).toString('hex')}`;
    const refreshToken = `mock_refresh_${randomBytes(8).toString('hex')}`;
    const openId = `mock_${randomBytes(6).toString('hex')}`;

    return {
      openId,
      displayName: 'Mock TikTok Account',
      avatarUrl: null,
      accessToken,
      refreshToken,
      expiresAt: this.calculateExpiry(now, 7200),
      refreshExpiresAt: this.calculateExpiry(now, 3600 * 24 * 30),
      scope: this.scopes.split(',').map((item) => item.trim()).filter(Boolean),
      timezoneOffsetMinutes: this.parseTimezone(dto.timezone),
      connectedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }
}
