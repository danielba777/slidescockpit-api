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
    return [...this.cache];
  }

  async upsertAccount(account: TikTokAccount): Promise<TikTokAccount> {
    await this.ready;
    const index = this.cache.findIndex((item) => item.openId === account.openId);
    if (index >= 0) {
      this.cache[index] = account;
    } else {
      this.cache.push(account);
    }

    await this.persist();
    return account;
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const content = await readFile(this.storagePath, 'utf8');
      const parsed: unknown = JSON.parse(content);
      if (Array.isArray(parsed)) {
        this.cache = parsed.filter(this.isTikTokAccount);
      } else {
        this.cache = [];
      }
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

  private isTikTokAccount(candidate: any): candidate is TikTokAccount {
    return (
      candidate &&
      typeof candidate === 'object' &&
      typeof candidate.openId === 'string'
    );
  }
}
