// src/slideshow-library/slideshow-library.module.ts
import { Module } from '@nestjs/common';
import { SlideshowLibraryController } from './slideshow-library.controller';
import { SlideshowAccountsService } from './slideshow-accounts.service';
import { SlideshowPostsService } from './slideshow-posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [SlideshowLibraryController],
  providers: [SlideshowAccountsService, SlideshowPostsService],
  exports: [SlideshowAccountsService, SlideshowPostsService],
})
export class SlideshowLibraryModule {}
