import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';

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
  ) {}

  onModuleInit(): void {
    this.queue.attachWorker(async (payload) => {
      const { userId, openId, body } = payload as ScheduleJobPayload;
      this.logger.log(`Executing scheduled TikTok post for user=${userId} openId=${openId}`);
      await this.postingService.post(userId, openId, body);
    });
  }
}

