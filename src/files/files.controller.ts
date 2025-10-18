import { Controller, Get, Query } from '@nestjs/common';

import { PresignRequestDto } from './dto/presign-request.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('presign')
  async presign(@Query() query: PresignRequestDto) {
    return this.filesService.createUploadUrl({
      key: query.key,
      contentType: query.contentType,
      expiresInSec: query.expiresInSec,
    });
  }
}
