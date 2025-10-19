import { Injectable, Logger } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../prisma/prisma.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';

export type PersistPayload = Prisma.InputJsonValue;

interface CompletionOptions {
  status: 'success' | 'inbox';
  publishId?: string;
  resultUrl?: string;
}

@Injectable()
export class ScheduledPostRepository {
  private readonly logger = new Logger(ScheduledPostRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createImmediatePost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    status: 'success' | 'inbox' | 'failed';
    publishId?: string;
    resultUrl?: string;
    idempotencyKey?: string;
  }) {
    const now = new Date();
    const normalizedOpenId = this.normalizeOpenId(options.openId);
    const status = this.mapStatus(options.status);
    const idempotencyKey = options.idempotencyKey ?? options.publishId ?? randomUUID();

    return this.prisma.scheduledPost.create({
      data: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status,
        runAt: now,
        jobId: null,
        publishId: options.publishId ?? null,
        resultUrl: options.resultUrl ?? null,
        idempotencyKey,
      },
    });
  }

  async createAsyncPost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    publishId: string;
  }) {
    const now = new Date();
    const normalizedOpenId = this.normalizeOpenId(options.openId);

    return this.prisma.scheduledPost.upsert({
      where: { idempotencyKey: options.publishId },
      create: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status: PostStatus.QUEUE,
        runAt: now,
        jobId: null,
        publishId: options.publishId,
        idempotencyKey: options.publishId,
      },
      update: {
        payload: options.payload,
        updatedAt: new Date(),
      },
    });
  }

  async createScheduledPost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    runAt: Date;
    jobId: string;
    idempotencyKey: string;
  }) {
    const normalizedOpenId = this.normalizeOpenId(options.openId);

    return this.prisma.scheduledPost.upsert({
      where: { idempotencyKey: options.idempotencyKey },
      create: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status: PostStatus.SCHEDULED,
        runAt: options.runAt,
        jobId: options.jobId,
        idempotencyKey: options.idempotencyKey,
      },
      update: {
        payload: options.payload,
        runAt: options.runAt,
        jobId: options.jobId,
        status: PostStatus.SCHEDULED,
        updatedAt: new Date(),
      },
    });
  }

  async markRunningByJobId(jobId: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: PostStatus.RUNNING,
        attempts: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }

  async markCompletedByJobId(jobId: string, options: CompletionOptions): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: this.mapStatus(options.status),
        publishId: options.publishId ?? null,
        resultUrl: options.resultUrl ?? null,
        updatedAt: new Date(),
      },
    });
  }

  async markFailedByJobId(jobId: string, error: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: PostStatus.FAILED,
        lastError: error,
        updatedAt: new Date(),
      },
    });
  }

  async markCompletedByPublishId(publishId: string, options: CompletionOptions): Promise<void> {
    const updated = await this.prisma.scheduledPost.updateMany({
      where: { publishId },
      data: {
        status: this.mapStatus(options.status),
        resultUrl: options.resultUrl ?? null,
        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      this.logger.debug(`No scheduled post found for publishId=${publishId} to mark as completed`);
    }
  }

  async markFailedByPublishId(publishId: string, error: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { publishId },
      data: {
        status: PostStatus.FAILED,
        lastError: error,
        updatedAt: new Date(),
      },
    });
  }

  async listPosts(userId: string, openId?: string) {
    return this.prisma.scheduledPost.findMany({
      where: {
        userId,
        ...(openId ? { targetOpenId: this.normalizeOpenId(openId) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private mapStatus(state: 'success' | 'inbox' | 'failed'): PostStatus {
    switch (state) {
      case 'success':
        return PostStatus.PUBLISHED;
      case 'inbox':
        return PostStatus.INBOX;
      case 'failed':
      default:
        return PostStatus.FAILED;
    }
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }
}
