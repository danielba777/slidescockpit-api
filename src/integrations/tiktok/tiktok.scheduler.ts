import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';
import { ScheduledPostRepository } from './scheduled-post.repository';

interface ScheduleJobPayload {
  userId: string;
  openId: string;
  body: TikTokPostRequestDto;
}

@Injectable()
export class TikTokScheduler implements OnModuleInit {
  private readonly logger = new Logger(TikTokScheduler.name);

  constructor(
    private readonly queue: QueueService,
    private readonly postingService: TikTokPostingService,
    private readonly posts: ScheduledPostRepository,
  ) {}

  onModuleInit(): void {
    this.queue.attachWorker(async (payload, job) => {
      const { userId, openId, body } = payload as ScheduleJobPayload;
      const jobId = job.id ?? '';
      this.logger.log(`Executing scheduled TikTok post for user=${userId} openId=${openId} jobId=${jobId}`);

      if (jobId) {
        await this.posts.markRunningByJobId(jobId);
      }

      try {
        await this.postingService.post(userId, openId, body, { jobId });
      } catch (error) {
        throw error;
      }
    });
  }
}
