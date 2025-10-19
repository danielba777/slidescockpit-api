import { BadRequestException, Body, Controller, Headers, Param, Post, ServiceUnavailableException } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { ScheduleTikTokDto } from './dto/schedule-tiktok.dto';

@Controller('integrations/social/tiktok')
export class TikTokScheduleController {
  constructor(private readonly queue: QueueService) {}

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
      throw new ServiceUnavailableException('Scheduling queue is not configured');
    }

    await this.queue.addDelayed(
      'tiktok.post.at',
      {
        idempotencyKey: body.idempotencyKey,
        userId: trimmedUserId,
        openId: openId.trim(),
        body: body.post,
      },
      when,
    );

    return {
      scheduled: true,
      runAt: when.toISOString(),
      jobKey: body.idempotencyKey,
    };
  }
}
