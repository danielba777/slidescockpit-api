import { Module } from '@nestjs/common';

import { SessionModule } from '../../common/session/session.module';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokController } from './tiktok.controller';
import { TikTokService } from './tiktok.service';

@Module({
  imports: [SessionModule],
  controllers: [TikTokController],
  providers: [TikTokService, TikTokAccountRepository],
})
export class TikTokModule {}

