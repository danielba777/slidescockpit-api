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
  @IsEnum(['DIRECT_POST', 'UPLOAD', 'MEDIA_UPLOAD', 'URL'])
  contentPostingMethod?: 'DIRECT_POST' | 'UPLOAD' | 'MEDIA_UPLOAD' | 'URL';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'FRIENDS', 'SELF_ONLY'])
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'SELF_ONLY';

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
  @IsEnum(['INBOX', 'PUBLISH', 'DIRECT_POST', 'MEDIA_UPLOAD'])
  postMode?: 'INBOX' | 'PUBLISH' | 'DIRECT_POST' | 'MEDIA_UPLOAD';

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
