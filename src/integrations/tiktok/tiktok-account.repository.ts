import { Injectable, Logger } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { TikTokAccount } from './tiktok.types';

@Injectable()
export class TikTokAccountRepository {
  private readonly logger = new Logger(TikTokAccountRepository.name);
  private readonly storagePath = join(
    process.cwd(),
    'storage',
    'tiktok-accounts.json',
  );
  private readonly ready: Promise<void>;
  private cache: TikTokAccount[] = [];

  constructor() {
    this.ready = this.loadFromDisk();
  }

  async listAccounts(): Promise<TikTokAccount[]> {
    await this.ready;
    return this.cache.map((account) => ({ ...account }));
  }

  async listAccountsForUser(userId: string): Promise<TikTokAccount[]> {
    await this.ready;
    return this.cache
      .filter((account) => account.userId === userId)
      .map((account) => ({ ...account }));
  }

  async getAccount(userId: string, openId: string): Promise<TikTokAccount | undefined> {
    await this.ready;
    const normalized = this.normalizeOpenId(openId);
    const found = this.cache.find(
      (account) =>
        account.userId === userId &&
        this.normalizeOpenId(account.openId) === normalized,
    );
    return found ? { ...found } : undefined;
  }

  async upsertAccount(account: TikTokAccount): Promise<TikTokAccount> {
    await this.ready;
    const normalizedOpenId = this.normalizeOpenId(account.openId);
    const record: TikTokAccount = {
      ...account,
      openId: normalizedOpenId,
      connectedAt: account.connectedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const index = this.cache.findIndex(
      (item) =>
        item.userId === record.userId &&
        this.normalizeOpenId(item.openId) === normalizedOpenId,
    );
    if (index >= 0) {
      this.cache[index] = record;
    } else {
      this.cache.push(record);
    }

    await this.persist();
    return record;
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const content = await readFile(this.storagePath, 'utf8');
      const parsed: unknown = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        this.cache = [];
        return;
      }

      this.cache = parsed
        .map(this.normalizeAccount.bind(this))
        .filter((account): account is TikTokAccount => account !== undefined);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.ensureDirectory();
        this.cache = [];
        await this.persist();
        return;
      }
      this.logger.warn(
        `Failed to load TikTok accounts store (${String(error)}) – continuing with empty store`,
      );
      this.cache = [];
    }
  }

  private async persist(): Promise<void> {
    await this.ensureDirectory();
    const payload = JSON.stringify(this.cache, null, 2);
    await writeFile(this.storagePath, payload, 'utf8');
  }

  private async ensureDirectory(): Promise<void> {
    await mkdir(dirname(this.storagePath), { recursive: true });
  }

  private normalizeAccount(candidate: any): TikTokAccount | undefined {
    if (!candidate || typeof candidate !== 'object') {
      return undefined;
    }

    if (typeof candidate.userId !== 'string' || candidate.userId.length === 0) {
      this.logger.warn(
        'Skipping TikTok account entry without userId. Consider re-connecting the account.',
      );
      return undefined;
    }

    if (typeof candidate.openId !== 'string' || candidate.openId.length === 0) {
      return undefined;
    }

    const normalizedOpenId = this.normalizeOpenId(candidate.openId);

    return {
      userId: candidate.userId,
      openId: normalizedOpenId,
      displayName:
        typeof candidate.displayName === 'string'
          ? candidate.displayName
          : null,
      username:
        typeof candidate.username === 'string' ? candidate.username : null,
      unionId:
        typeof candidate.unionId === 'string' ? candidate.unionId : null,
      avatarUrl:
        typeof candidate.avatarUrl === 'string' ? candidate.avatarUrl : null,
      accessToken:
        typeof candidate.accessToken === 'string' ? candidate.accessToken : '',
      refreshToken:
        typeof candidate.refreshToken === 'string'
          ? candidate.refreshToken
          : null,
      expiresAt:
        typeof candidate.expiresAt === 'string'
          ? candidate.expiresAt
          : new Date().toISOString(),
      refreshExpiresAt:
        typeof candidate.refreshExpiresAt === 'string'
          ? candidate.refreshExpiresAt
          : null,
      scope: this.parseScope(candidate.scope),
      timezoneOffsetMinutes:
        typeof candidate.timezoneOffsetMinutes === 'number'
          ? candidate.timezoneOffsetMinutes
          : null,
      connectedAt:
        typeof candidate.connectedAt === 'string'
          ? candidate.connectedAt
          : new Date().toISOString(),
      updatedAt:
        typeof candidate.updatedAt === 'string'
          ? candidate.updatedAt
          : new Date().toISOString(),
    };
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }

  private parseScope(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .map((entry) => (typeof entry === 'string' ? entry : String(entry)))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    if (typeof value === 'string') {
      return value
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    return [];
  }
}
