import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSlideshowAccountDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  followerCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  followingCount?: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
