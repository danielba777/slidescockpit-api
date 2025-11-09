import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AiAvatarGenerationJobsService } from './ai-avatar-generation-jobs.service';
import { AiAvatarGenerationJobStatus } from '@prisma/client';

@Controller('ai-avatars')
export class AiAvatarGenerationJobsController {
  constructor(private readonly jobsService: AiAvatarGenerationJobsService) {}

  @Post('generations/jobs')
  async createJob(
    @Headers('x-user-id') userId: string | undefined,
    @Body()
    body: {
      prompt?: string;
      expectedImages?: number;
    },
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    const job = await this.jobsService.createJob({
      userId: resolvedUserId,
      prompt: body?.prompt ?? '',
      expectedImages: body?.expectedImages,
    });
    return job;
  }

  @Get('generations/jobs')
  async listJobs(@Headers('x-user-id') userId: string | undefined) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.jobsService.listPendingJobs(resolvedUserId);
  }

  @Patch('generations/jobs/:id')
  async updateJobStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status?: AiAvatarGenerationJobStatus;
      errorMessage?: string;
    },
  ) {
    if (!body?.status) {
      throw new BadRequestException('status is required');
    }
    return this.jobsService.updateJobStatus({
      jobId: id,
      status: body.status,
      errorMessage: body.errorMessage,
    });
  }

  private ensureUserId(userId?: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('x-user-id header is required');
    }
    return userId;
  }
}
