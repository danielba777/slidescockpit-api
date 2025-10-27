import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiAvatarGenerationJobStatus } from '@prisma/client';

interface CreateJobInput {
  userId: string;
  prompt: string;
  expectedImages?: number;
}

interface UpdateJobStatusInput {
  jobId: string;
  status: AiAvatarGenerationJobStatus;
  errorMessage?: string | null;
}

@Injectable()
export class AiAvatarGenerationJobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(input: CreateJobInput) {
    if (!input.userId?.trim()) {
      throw new BadRequestException('User id is required');
    }

    if (!input.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }

    const expectedImages =
      typeof input.expectedImages === 'number' && input.expectedImages > 0
        ? input.expectedImages
        : 4;

    const job = await this.prisma.aiAvatarGenerationJob.create({
      data: {
        userId: input.userId,
        prompt: input.prompt.trim(),
        expectedImages,
      },
    });

    return this.serializeJob(job);
  }

  async listPendingJobs(userId: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('User id is required');
    }

    const jobs = await this.prisma.aiAvatarGenerationJob.findMany({
      where: {
        userId,
        status: AiAvatarGenerationJobStatus.PENDING,
      },
      orderBy: { startedAt: 'asc' },
    });

    return jobs.map((job) => this.serializeJob(job));
  }

  async updateJobStatus(input: UpdateJobStatusInput) {
    const job = await this.prisma.aiAvatarGenerationJob.findUnique({
      where: { id: input.jobId },
    });

    if (!job) {
      throw new NotFoundException('Generation job not found');
    }

    const update = await this.prisma.aiAvatarGenerationJob.update({
      where: { id: input.jobId },
      data: {
        status: input.status,
        completedAt: new Date(),
        errorMessage: input.errorMessage ?? null,
      },
    });

    return this.serializeJob(update);
  }

  private serializeJob(job: {
    id: string;
    prompt: string;
    expectedImages: number;
    status: AiAvatarGenerationJobStatus;
    startedAt: Date;
    completedAt: Date | null;
    errorMessage: string | null;
  }) {
    return {
      id: job.id,
      prompt: job.prompt,
      expectedImages: job.expectedImages,
      status: job.status,
      startedAt: job.startedAt.toISOString(),
      completedAt: job.completedAt?.toISOString() ?? null,
      errorMessage: job.errorMessage,
    };
  }
}
