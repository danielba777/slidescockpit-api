import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, TikTokModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
