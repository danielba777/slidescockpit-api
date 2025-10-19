import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, JobsOptions, Queue, Worker } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

interface ScheduleJobPayload {
  idempotencyKey: string;
  userId: string;
  openId: string;
  body: unknown;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection?: IORedis;
  private workerConnection?: IORedis;
  private queue?: Queue<ScheduleJobPayload>;
  private worker?: Worker<ScheduleJobPayload>;

  async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn('REDIS_URL is not set; scheduling features are disabled');
      return;
    }

    this.connection = this.createConnection(redisUrl);
    this.queue = new Queue<ScheduleJobPayload>(process.env.POST_SCHEDULE_QUEUE ?? 'tiktok-posts', {
      connection: this.connection,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
    await this.workerConnection?.quit();
    await this.connection?.quit();
  }

  async addDelayed(
    name: string,
    payload: ScheduleJobPayload,
    runAt: Date,
    opts: Partial<JobsOptions> = {},
  ) {
    if (!this.queue) {
      throw new Error('Queue not initialised');
    }

    const group = this.sanitizeForJobId(process.env.POST_SCHEDULE_GROUP ?? 'slidescockpit');
    const baseKey = this.sanitizeForJobId(String(payload.idempotencyKey ?? Date.now()));
    const jobId = `${group}-${baseKey}`;
    return this.queue.add(name, payload, {
      jobId,
      delay: Math.max(0, runAt.getTime() - Date.now()),
      removeOnComplete: 500,
      removeOnFail: 1000,
      ...opts,
    });
  }

  attachWorker(
    processor: (payload: ScheduleJobPayload, job: Job<ScheduleJobPayload>) => Promise<void>,
  ): void {
    if (!this.queue || !this.connection) {
      this.logger.warn('Queue not initialised; worker not attached');
      return;
    }
    if (this.worker) {
      return;
    }

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn('REDIS_URL is not set; worker cannot attach');
      return;
    }

    this.workerConnection = this.createConnection(redisUrl);
    this.worker = new Worker<ScheduleJobPayload>(this.queue.name, async (job) => processor(job.data, job), {
      connection: this.workerConnection,
      concurrency: 1,
    });
  }

  isReady(): boolean {
    return Boolean(this.queue);
  }

  private createConnection(redisUrl: string): IORedis {
    const baseOptions: RedisOptions = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 10_000,
      keepAlive: 10_000,
    };
    return new IORedis(redisUrl, baseOptions);
  }

  private sanitizeForJobId(value: string): string {
    const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, '-');
    return sanitized.length > 0 ? sanitized : `job-${Date.now()}`;
  }
}
