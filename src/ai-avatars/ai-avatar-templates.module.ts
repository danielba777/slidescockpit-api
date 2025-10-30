// src/ai-avatars/ai-avatar-templates.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAvatarTemplatesService } from './ai-avatar-templates.service';
import { AiAvatarTemplatesController } from './ai-avatar-templates.controller';
import { AiAvatarGenerationsService } from './ai-avatar-generations.service';
import { AiAvatarGenerationsController } from './ai-avatar-generations.controller';
import { AiAvatarGenerationJobsService } from './ai-avatar-generation-jobs.service';
import { AiAvatarGenerationJobsController } from './ai-avatar-generation-jobs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    AiAvatarTemplatesController,
    AiAvatarGenerationsController,
    AiAvatarGenerationJobsController,
  ],
  providers: [
    AiAvatarTemplatesService,
    AiAvatarGenerationsService,
    AiAvatarGenerationJobsService,
  ],
  exports: [
    AiAvatarTemplatesService,
    AiAvatarGenerationsService,
    AiAvatarGenerationJobsService,
  ],
})
export class AiAvatarTemplatesModule {}
