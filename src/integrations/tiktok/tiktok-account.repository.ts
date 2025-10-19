import { Injectable } from '@nestjs/common';
import { TikTokAccount as TikTokAccountEntity } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { TikTokAccount } from './tiktok.types';

@Injectable()
export class TikTokAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAccounts(): Promise<TikTokAccount[]> {
    const records = await this.prisma.tikTokAccount.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async listAccountsForUser(userId: string): Promise<TikTokAccount[]> {
    const records = await this.prisma.tikTokAccount.findMany({
      where: { userId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async getAccount(userId: string, openId: string): Promise<TikTokAccount | undefined> {
    const normalizedOpenId = this.normalizeOpenId(openId);
    const record = await this.prisma.tikTokAccount.findUnique({
      where: {
        userId_openId: {
          userId,
          openId: normalizedOpenId,
        },
      },
    });

    return record ? this.toDomain(record) : undefined;
  }

  async upsertAccount(account: TikTokAccount): Promise<TikTokAccount> {
    const normalizedOpenId = this.normalizeOpenId(account.openId);

    const result = await this.prisma.tikTokAccount.upsert({
      where: {
        userId_openId: {
          userId: account.userId,
          openId: normalizedOpenId,
        },
      },
      update: this.toPersistence(account, normalizedOpenId),
      create: this.toPersistence(account, normalizedOpenId),
    });

    return this.toDomain(result);
  }

  private toDomain(record: TikTokAccountEntity): TikTokAccount {
    return {
      userId: record.userId,
      openId: record.openId,
      displayName: record.displayName ?? null,
      username: record.username ?? null,
      unionId: record.unionId ?? null,
      avatarUrl: record.avatarUrl ?? null,
      accessToken: record.accessToken,
      refreshToken: record.refreshToken ?? null,
      expiresAt: record.expiresAt.toISOString(),
      refreshExpiresAt: record.refreshExpiresAt?.toISOString() ?? null,
      scope: record.scope ?? [],
      timezoneOffsetMinutes: record.timezoneOffsetMinutes ?? null,
      connectedAt: record.connectedAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private toPersistence(account: TikTokAccount, normalizedOpenId: string) {
    return {
      userId: account.userId,
      openId: normalizedOpenId,
      displayName: account.displayName,
      username: account.username,
      unionId: account.unionId,
      avatarUrl: account.avatarUrl,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      expiresAt: new Date(account.expiresAt),
      refreshExpiresAt: account.refreshExpiresAt ? new Date(account.refreshExpiresAt) : null,
      scope: account.scope ?? [],
      timezoneOffsetMinutes: account.timezoneOffsetMinutes,
      connectedAt: new Date(account.connectedAt ?? new Date().toISOString()),
      updatedAt: new Date(),
    };
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }
}

