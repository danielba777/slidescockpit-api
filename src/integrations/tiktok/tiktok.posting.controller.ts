import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';

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
    @Query('async') asyncFlag?: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    if (typeof asyncFlag === 'string' && /^(1|true)$/i.test(asyncFlag.trim())) {
      const init = await this.postingService.postAsync(
        resolvedUserId,
        openId,
        body,
      );
      return {
        accepted: true,
        publishId: init.publishId,
        status: 'processing' as const,
      };
    }

    const result = await this.postingService.post(resolvedUserId, openId, body);
    return {
      success: true,
      postId: result.postId,
      releaseUrl: result.releaseUrl,
      status: result.status,
    };
  }

  @Get(':openId/post/status/:publishId')
  async getPostStatus(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Param('publishId') publishId: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.fetchStatus(resolvedUserId, openId, publishId);
  }

  @Get(':openId/posts')
  async listPostsForAccount(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.listPosts(resolvedUserId, openId);
  }

  @Get('posts')
  async listPosts(@Headers('x-user-id') userId: string) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.listPosts(resolvedUserId);
  }

  private ensureUserId(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return value.trim();
  }
}
