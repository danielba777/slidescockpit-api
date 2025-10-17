import { Module } from '@nestjs/common';

import { SessionModule } from '../../common/session/session.module';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokController } from './tiktok.controller';
import { TikTokPostingController } from './tiktok.posting.controller';
import { TikTokPostingProvider } from './tiktok.posting.provider';
import { TikTokPostingService } from './tiktok.posting.service';
import { TikTokService } from './tiktok.service';

@Module({
  imports: [SessionModule],
  controllers: [TikTokController, TikTokPostingController],
  providers: [TikTokService, TikTokPostingService, TikTokPostingProvider, TikTokAccountRepository],
})
export class TikTokModule {}
