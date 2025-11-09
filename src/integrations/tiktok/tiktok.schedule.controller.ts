import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Param,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { ScheduleTikTokDto } from './dto/schedule-tiktok.dto';
import {
  PersistPayload,
  ScheduledPostRepository,
} from './scheduled-post.repository';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';

@Controller('integrations/social/tiktok')
export class TikTokScheduleController {
  constructor(
    private readonly queue: QueueService,
    private readonly posts: ScheduledPostRepository,
  ) {}

  @Post(':openId/schedule')
  async schedulePost(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Body() body: ScheduleTikTokDto,
  ) {
    const trimmedUserId = userId?.trim();
    if (!trimmedUserId) {
      throw new BadRequestException('Missing x-user-id header');
    }

    const when = new Date(body.publishAt);
    if (Number.isNaN(when.getTime())) {
      throw new BadRequestException('Invalid publishAt');
    }

    if (!this.queue.isReady()) {
      throw new ServiceUnavailableException(
        'Scheduling queue is not configured',
      );
    }

    const normalizedOpenId = openId.trim();

    const job = await this.queue.addDelayed(
      'tiktok.post.at',
      {
        idempotencyKey: body.idempotencyKey,
        userId: trimmedUserId,
        openId: normalizedOpenId,
        body: body.post,
      },
      when,
    );

    const jobId = job.id ?? body.idempotencyKey;

    await this.posts.createScheduledPost({
      userId: trimmedUserId,
      openId: normalizedOpenId,
      payload: this.toPersistPayload(body.post),
      runAt: when,
      jobId,
      idempotencyKey: body.idempotencyKey,
    });

    return {
      scheduled: true,
      runAt: when.toISOString(),
      jobKey: jobId,
    };
  }

  private toPersistPayload(payload: TikTokPostRequestDto): PersistPayload {
    return {
      caption: payload.caption ?? '',
      media: payload.media ?? [],
      postMode: payload.postMode,
      settings: payload.settings,
    } as unknown as PersistPayload;
  }
}
