import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
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
  async createGeneration(
    @Headers('x-user-id') userId: string | undefined,
    @Body()
    body: {
      prompt?: string;
      sourceUrl?: string;
      rawImageUrl?: string | null;
    },
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    if (!body?.prompt) {
      throw new BadRequestException('Prompt is required');
    }
    if (!body?.sourceUrl) {
      throw new BadRequestException('Source image URL is required');
    }

    return this.generationsService.saveGeneration({
      userId: resolvedUserId,
      prompt: body.prompt,
      sourceUrl: body.sourceUrl,
      rawImageUrl: body.rawImageUrl,
    });
  }

  private ensureUserId(userId?: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('x-user-id header is required');
    }
    return userId;
  }
}
