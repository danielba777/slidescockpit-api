import { BadRequestException, Body, Controller, Headers, Param, Post } from '@nestjs/common';

import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';

@Controller('integrations/social/tiktok')
export class TikTokPostingController {
  constructor(private readonly postingService: TikTokPostingService) {}

  @Post(':openId/post')
  async postToTikTok(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Body() body: TikTokPostRequestDto,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    const result = await this.postingService.post(resolvedUserId, openId, body);
    return {
      success: true,
      postId: result.postId,
      releaseUrl: result.releaseUrl,
      status: result.status,
    };
  }

  private ensureUserId(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return value.trim();
  }
}
