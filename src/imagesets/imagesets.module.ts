import { Module } from '@nestjs/common';
import { ImagesetsController } from './imagesets.controller';
import { ImagesetsService } from './imagesets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [ImagesetsController],
  providers: [ImagesetsService],
  exports: [ImagesetsService],
})
export class ImagesetsModule {}
