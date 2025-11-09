import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectTikTokDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}
