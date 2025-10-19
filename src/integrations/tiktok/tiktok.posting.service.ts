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

interface TikTokPostOutcome {
  postId: string;
  releaseUrl: string;
  status: 'success';
}

@Injectable()
export class TikTokPostingService {
  private readonly logger = new Logger(TikTokPostingService.name);

  constructor(
    private readonly repository: TikTokAccountRepository,
    private readonly provider: TikTokPostingProvider,
  ) {}

  async post(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
  ): Promise<TikTokPostOutcome> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const result = await this.provider.post(readyAccount, payload);
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
      });
      return result;
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
  ): Promise<{ status: 'processing' | 'failed' | 'success'; postId?: string; releaseUrl?: string }> {
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
        return {
          status: 'success',
          postId: result.id,
          releaseUrl: result.url,
        };
      }
      if (result.status === 'processing') {
        return { status: 'processing' };
      }
      return { status: 'failed' };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok status check failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
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
}
