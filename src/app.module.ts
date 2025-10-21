import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ImagesetsModule } from './imagesets/imagesets.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    AuthModule,
    TikTokModule,
    FilesModule,
    ImagesetsModule,
    PrismaModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
