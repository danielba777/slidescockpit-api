import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiAvatarGenerationsService } from './ai-avatar-generations.service';

@Controller('ai-avatars')
export class AiAvatarGenerationsController {
  constructor(
    private readonly generationsService: AiAvatarGenerationsService,
  ) {}

  @Get('generations')
  async listGenerations(@Headers('x-user-id') userId?: string) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.generationsService.listGenerations(resolvedUserId);
  }

  @Post('generations')
  @UseInterceptors(FileInterceptor('image'))
  async createGeneration(
    @Headers('x-user-id') userId: string | undefined,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { prompt?: string; rawImageUrl?: string; jobId?: string },
  ) {
    const resolvedUserId = this.ensureUserId(userId);

    if (!body?.prompt) {
      throw new BadRequestException('Prompt is required');
    }

    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    return this.generationsService.saveGenerationFromBuffer({
      userId: resolvedUserId,
      prompt: body.prompt,
      imageBuffer: image.buffer,
      rawImageUrl: body.rawImageUrl || null,
      jobId: body.jobId || null,
    });
  }

  private ensureUserId(userId?: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('x-user-id header is required');
    }
    return userId;
  }
}
