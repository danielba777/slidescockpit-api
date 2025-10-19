import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [AuthModule, TikTokModule, FilesModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
