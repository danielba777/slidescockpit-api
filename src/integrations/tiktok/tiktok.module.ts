import { Module } from '@nestjs/common';

import { SessionModule } from '../../common/session/session.module';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokController } from './tiktok.controller';
import { TikTokPostingController } from './tiktok.posting.controller';
import { TikTokPostingProvider } from './tiktok.posting.provider';
import { TikTokPostingService } from './tiktok.posting.service';
import { TikTokService } from './tiktok.service';
import { TikTokScheduler } from './tiktok.scheduler';
import { TikTokScheduleController } from './tiktok.schedule.controller';
import { ScheduledPostRepository } from './scheduled-post.repository';

@Module({
  imports: [SessionModule],
  controllers: [
    TikTokController,
    TikTokPostingController,
    TikTokScheduleController,
  ],
  providers: [
    TikTokService,
    TikTokPostingService,
    TikTokPostingProvider,
    TikTokAccountRepository,
    ScheduledPostRepository,
    TikTokScheduler,
  ],
})
export class TikTokModule {}
