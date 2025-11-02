// src/app.module.ts
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ImagesetsModule } from './imagesets/imagesets.module';
import { SlideshowLibraryModule } from './slideshow-library/slideshow-library.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { AiAvatarTemplatesModule } from './ai-avatars/ai-avatar-templates.module';
import { LandingPageThemesModule } from './landing-page-themes/landing-page-themes.module';

@Module({
  imports: [
    AuthModule,
    TikTokModule,
    FilesModule,
    ImagesetsModule,
    SlideshowLibraryModule,
    LandingPageThemesModule,
    PrismaModule,
    QueueModule,
    AiAvatarTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
