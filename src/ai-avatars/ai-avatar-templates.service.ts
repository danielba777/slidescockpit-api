// src/ai-avatars/ai-avatar-templates.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { Express } from 'express';

interface CreateTemplateInput {
  prompt: string;
  imageUrl: string;
  imageKey: string;
}

@Injectable()
export class AiAvatarTemplatesService {
  private readonly bucket =
    process.env.HCLOUD_S3_BUCKET ?? 'slidescockpit-files';
  private readonly publicBaseUrl =
    process.env.HCLOUD_S3_PUBLIC_BASE_URL ??
    'https://files.slidescockpit.com';

  private readonly s3 = new S3Client({
    region: process.env.HCLOUD_S3_REGION ?? 'nbg1',
    endpoint:
      process.env.HCLOUD_S3_ENDPOINT ??
      'https://nbg1.your-objectstorage.com',
    forcePathStyle: false,
    credentials: {
      accessKeyId: this.requireEnv('HCLOUD_S3_KEY'),
      secretAccessKey: this.requireEnv('HCLOUD_S3_SECRET'),
    },
  });

  constructor(private prisma: PrismaService) {}

  async listTemplates() {
    return this.prisma.aiAvatarTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(input: CreateTemplateInput) {
    if (!input.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }
    if (!input.imageUrl || !input.imageKey) {
      throw new BadRequestException('Image information missing');
    }

    return this.prisma.aiAvatarTemplate.create({
      data: {
        prompt: input.prompt.trim(),
        imageUrl: input.imageUrl,
        imageKey: input.imageKey,
      },
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.prisma.aiAvatarTemplate.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: template.imageKey,
    });

    try {
      await this.s3.send(deleteCommand);
    } catch (error) {
      console.error('Failed to delete template image', error);
    }

    await this.prisma.aiAvatarTemplate.delete({ where: { id } });
    return { success: true };
  }

  async uploadTemplateImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string; contentType: string }> {
    if (!file) {
      throw new BadRequestException('Image file missing');
    }

    const uniqueId = randomUUID();
    const key = `ai-avatars/templates/${uniqueId}.webp`;

    const processedBuffer = await sharp(file.buffer)
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'centre',
      })
      .webp({ quality: 90 })
      .toBuffer();

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    });

    await this.s3.send(uploadCommand);

    return {
      url: `${this.publicBaseUrl}/${key}`,
      key,
      contentType: 'image/webp',
    };
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
      throw new InternalServerErrorException(
        `${name} environment variable is not configured`,
      );
    }
    return value;
  }
}
