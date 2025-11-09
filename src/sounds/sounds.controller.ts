import { Controller, Get, Query } from '@nestjs/common';
import { SoundsService } from './sounds.service';
import { FilesService } from '../files/files.service';

@Controller('sounds')
export class SoundsController {
  constructor(
    private readonly sounds: SoundsService,
    private readonly files: FilesService,
  ) {}

  // Listet alle Sounds + optionales Cover aus dem Hetzner-S3 unter "ugc/sounds/"
  @Get()
  async listSounds() {
    const items = await this.sounds.list();
    return { sounds: items };
  }

  // Liefert Presign + Public-URL für einen spezifischen Key
  // Beispiel: GET /sounds/presign?key=ugc/sounds/1731033345-my_song.mp3&contentType=audio/mpeg
  @Get('presign')
  async presign(
    @Query('key') key: string,
    @Query('contentType') contentType?: string,
  ) {
    const res = await this.files.createUploadUrl({
      key,
      contentType,
      expiresInSec: 900,
    });
    return res;
  }
}
