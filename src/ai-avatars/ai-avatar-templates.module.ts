// src/ai-avatars/ai-avatar-templates.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAvatarTemplatesService } from './ai-avatar-templates.service';
import { AiAvatarTemplatesController } from './ai-avatar-templates.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AiAvatarTemplatesController],
  providers: [AiAvatarTemplatesService],
  exports: [AiAvatarTemplatesService],
})
export class AiAvatarTemplatesModule {}
