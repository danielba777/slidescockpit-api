import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import {
  BadBody,
  NotEnoughScopes,
  RefreshToken,
} from '../social/social.abstract';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokAccount } from './tiktok.types';
import { TikTokPostingProvider } from './tiktok.posting.provider';
import { PersistPayload, ScheduledPostRepository } from './scheduled-post.repository';

interface TikTokPostOutcome {
  postId: string;
  releaseUrl?: string;
  status: 'success' | 'inbox';
}

@Injectable()
export class TikTokPostingService {
  private readonly logger = new Logger(TikTokPostingService.name);

  constructor(
    private readonly repository: TikTokAccountRepository,
    private readonly provider: TikTokPostingProvider,
    private readonly posts: ScheduledPostRepository,
  ) {}

  async post(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
    options?: { jobId?: string },
  ): Promise<TikTokPostOutcome> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    // Debug: Log current scopes
    this.logger.debug(`TikTok account current scopes: ${account.scope?.join(', ') || '(none)'}`);
    this.logger.debug(`Required scopes: ${['user.info.basic', 'video.upload', 'video.publish'].join(', ')}`);

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const result = await this.provider.post(readyAccount, payload);
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
      });

      if (options?.jobId) {
        await this.posts.markCompletedByJobId(options.jobId, {
          status: result.status,
          publishId: result.postId,
          resultUrl: result.releaseUrl,
        });
      } else {
        await this.posts.createImmediatePost({
          userId,
          openId,
          payload: this.toPersistPayload(payload),
          status: result.status,
          publishId: result.postId,
          resultUrl: result.releaseUrl,
        });
      }

      return result;
    } catch (error) {
      const message = this.extractErrorMessage(error);
      if (options?.jobId) {
        await this.posts.markFailedByJobId(options.jobId, message);
      } else {
        await this.posts.createImmediatePost({
          userId,
          openId,
          payload: this.toPersistPayload(payload),
          status: 'failed',
          idempotencyKey: undefined,
        }).catch(() => undefined);
      }

      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotEnoughScopes) {
        throw new BadRequestException(
          `Missing TikTok permissions: ${error.missingScopes.join(', ')}`,
        );
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok post failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async postAsync(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
  ): Promise<{ publishId: string }> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const { publishId } = await this.provider.initPostOnly(readyAccount, payload);
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
      });

      await this.posts.createAsyncPost({
        userId,
        openId,
        payload: this.toPersistPayload(payload),
        publishId,
      });
      return { publishId };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotEnoughScopes) {
        throw new BadRequestException(
          `Missing TikTok permissions: ${error.missingScopes.join(', ')}`,
        );
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok post init failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async fetchStatus(
    userId: string,
    openId: string,
    publishId: string,
  ): Promise<{ status: 'processing' | 'failed' | 'success' | 'inbox'; postId?: string; releaseUrl?: string }> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const result = await this.provider.fetchPublishStatus(
        readyAccount.username ?? readyAccount.openId,
        publishId,
        readyAccount.accessToken,
      );

      if (result.status === 'success') {
        await this.posts.markCompletedByPublishId(publishId, {
          status: 'success',
          resultUrl: result.url,
        });
        return {
          status: 'success',
          postId: result.id,
          releaseUrl: result.url,
        };
      }
      if (result.status === 'inbox') {
        await this.posts.markCompletedByPublishId(publishId, {
          status: 'inbox',
        });
        return { status: 'inbox', postId: result.id };
      }
      if (result.status === 'processing') {
        return { status: 'processing' };
      }
      await this.posts.markFailedByPublishId(publishId, 'TikTok reported failure');
      return { status: 'failed' };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok status check failed (${error.code}): ${error.hint ?? error.message}`,
        );
        await this.posts.markFailedByPublishId(publishId, error.hint ?? error.message);
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async listPosts(userId: string, openId?: string) {
    return this.posts.listPosts(userId, openId);
  }

  private async ensureFreshToken(account: TikTokAccount): Promise<TikTokAccount> {
    const expiresAt = Date.parse(account.expiresAt);
    const needsRefresh =
      Number.isNaN(expiresAt) || expiresAt - Date.now() < 60 * 1000;

    if (!needsRefresh) {
      return account;
    }

    if (!account.refreshToken) {
      throw new BadRequestException(
        'TikTok access token expired and no refresh token available',
      );
    }

    this.logger.debug(
      `Refreshing TikTok token for account ${account.openId} (user ${account.userId})`,
    );

    const refreshed = await this.provider.refreshToken(account.refreshToken);

    const updatedAccount: TikTokAccount = {
      ...account,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? account.refreshToken,
      expiresAt: this.calculateExpiry(refreshed.expiresIn ?? 3600),
      refreshExpiresAt: refreshed.refreshExpiresIn
        ? this.calculateExpiry(refreshed.refreshExpiresIn)
        : account.refreshExpiresAt,
      scope: refreshed.scope,
      displayName: refreshed.displayName ?? account.displayName,
      username: refreshed.username ?? account.username,
      avatarUrl: refreshed.avatarUrl ?? account.avatarUrl,
      openId: refreshed.openId ?? account.openId,
    };

    await this.repository.upsertAccount(updatedAccount);
    return updatedAccount;
  }

  private calculateExpiry(seconds: number): string {
    const base = Date.now();
    return new Date(base + seconds * 1000).toISOString();
  }

  private toPersistPayload(payload: TikTokPostRequestDto): PersistPayload {
    return {
      caption: payload.caption ?? '',
      media: payload.media ?? [],
      postMode: payload.postMode,
      settings: payload.settings,
    } as unknown as PersistPayload;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof BadBody) {
      return error.hint ?? error.message;
    }
    if (error instanceof RefreshToken) {
      return error.message;
    }
    if (error instanceof NotEnoughScopes) {
      return `Missing TikTok permissions: ${error.missingScopes.join(', ')}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
