import { Module } from '@nestjs/common';
import { SoundsController } from './sounds.controller';
import { SoundsService } from './sounds.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [SoundsController],
  providers: [SoundsService],
  exports: [SoundsService],
})
export class SoundsModule {}
