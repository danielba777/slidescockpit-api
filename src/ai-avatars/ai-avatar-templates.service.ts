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
  name: string;
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
    if (!input.name?.trim() || !input.prompt?.trim()) {
      throw new BadRequestException('Name and prompt are required');
    }
    if (!input.imageUrl || !input.imageKey) {
      throw new BadRequestException('Image information missing');
    }

    const slug = await this.generateUniqueSlug(input.name.trim());

    return this.prisma.aiAvatarTemplate.create({
      data: {
        name: input.name.trim(),
        slug,
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
    nameHint?: string,
  ): Promise<{ url: string; key: string; contentType: string }> {
    if (!file) {
      throw new BadRequestException('Image file missing');
    }

    const slug =
      (nameHint ? this.slugify(nameHint) : 'ai-avatar') || 'ai-avatar';
    const uniqueId = randomUUID();
    const key = `ai-avatars/templates/${slug}-${uniqueId}.webp`;

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

  private async generateUniqueSlug(baseName: string): Promise<string> {
    const base = this.slugify(baseName);
    let slug = base;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.aiAvatarTemplate.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!existing) {
        return slug;
      }
      slug = `${base}-${suffix++}`;
    }
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .substring(0, 60);
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
