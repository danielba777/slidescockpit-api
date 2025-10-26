// src/ai-avatars/ai-avatar-templates.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AiAvatarTemplatesService } from './ai-avatar-templates.service';

@Controller('ai-avatars')
export class AiAvatarTemplatesController {
  constructor(
    private readonly templatesService: AiAvatarTemplatesService,
  ) {}

  @Get('templates')
  listTemplates() {
    return this.templatesService.listTemplates();
  }

  @Post('templates')
  createTemplate(
    @Body()
    body: {
      prompt: string;
      imageUrl: string;
      imageKey: string;
    },
  ) {
    return this.templatesService.createTemplate(body);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Template id is required');
    }
    return this.templatesService.deleteTemplate(id);
  }

  @Post('templates/upload-image')
  @UseInterceptors(FilesInterceptor('image', 1))
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    const file = files?.[0];
    if (!file) {
      throw new BadRequestException('No image uploaded');
    }
    return this.templatesService.uploadTemplateImage(file);
  }
}
