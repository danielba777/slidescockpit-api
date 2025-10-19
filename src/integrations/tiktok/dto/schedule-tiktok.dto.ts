import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { TikTokPostRequestDto } from './post-tiktok.dto';

export class ScheduleTikTokDto {
  @IsDateString()
  publishAt!: string;

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @ValidateNested()
  @Type(() => TikTokPostRequestDto)
  post!: TikTokPostRequestDto;
}

