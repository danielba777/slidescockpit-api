import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TikTokPostingSettingsDto {
  @IsOptional()
  @IsEnum(['DIRECT_POST', 'UPLOAD'])
  contentPostingMethod?: 'DIRECT_POST' | 'UPLOAD';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  privacyLevel?: string;

  @IsOptional()
  @IsBoolean()
  duet?: boolean;

  @IsOptional()
  @IsBoolean()
  comment?: boolean;

  @IsOptional()
  @IsBoolean()
  stitch?: boolean;

  @IsOptional()
  @IsBoolean()
  videoMadeWithAi?: boolean;

  @IsOptional()
  @IsBoolean()
  brandContentToggle?: boolean;

  @IsOptional()
  @IsBoolean()
  brandOrganicToggle?: boolean;

  @IsOptional()
  @IsBoolean()
  autoAddMusic?: boolean;
}

export class TikTokMediaDto {
  @IsEnum(['video', 'photo'])
  type!: 'video' | 'photo';

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  thumbnailTimestampMs?: number;
}

export class TikTokPostRequestDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsEnum(['INBOX', 'PUBLISH'])
  postMode?: 'INBOX' | 'PUBLISH';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TikTokMediaDto)
  media!: TikTokMediaDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TikTokPostingSettingsDto)
  settings?: TikTokPostingSettingsDto;
}
