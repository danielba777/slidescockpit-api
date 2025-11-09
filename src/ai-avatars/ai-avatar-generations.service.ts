import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

interface SaveGenerationInput {
  userId: string;
  prompt: string;
  sourceUrl: string;
  rawImageUrl?: string | null;
  jobId?: string | null;
}

interface SaveGenerationFromBufferInput {
  userId: string;
  prompt: string;
  imageBuffer: Buffer;
  rawImageUrl?: string | null;
  jobId?: string | null;
}

@Injectable()
export class AiAvatarGenerationsService {
  private readonly bucket =
    process.env.HCLOUD_S3_BUCKET ?? 'slidescockpit-files';
  private readonly publicBaseUrl =
    process.env.HCLOUD_S3_PUBLIC_BASE_URL ?? 'https://files.slidescockpit.com';

  private readonly s3 = new S3Client({
    region: process.env.HCLOUD_S3_REGION ?? 'nbg1',
    endpoint:
      process.env.HCLOUD_S3_ENDPOINT ?? 'https://nbg1.your-objectstorage.com',
    forcePathStyle: false,
    credentials: {
      accessKeyId: this.requireEnv('HCLOUD_S3_KEY'),
      secretAccessKey: this.requireEnv('HCLOUD_S3_SECRET'),
    },
  });

  constructor(private readonly prisma: PrismaService) {}

  async listGenerations(userId: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('User id is required');
    }

    const generations = await this.prisma.aiAvatarGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });

    return generations.map((generation) =>
      this.serializeGeneration(generation),
    );
  }

  async saveGeneration(input: SaveGenerationInput) {
    if (!input.userId?.trim()) {
      throw new BadRequestException('User id is required');
    }

    if (!input.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }

    const sourceUrl = input.sourceUrl?.trim();
    if (!sourceUrl) {
      throw new BadRequestException('Source image URL is required');
    }

    const sourceBuffer = await this.downloadImage(sourceUrl);
    const processedBuffer = await this.normalizeImageBuffer(sourceBuffer);

    const uniqueId = randomUUID();
    const objectKey = `ai-avatars/users/${input.userId}/${uniqueId}.webp`;

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    });

    await this.s3.send(uploadCommand);

    const generation = await this.prisma.aiAvatarGeneration.create({
      data: {
        userId: input.userId,
        prompt: input.prompt.trim(),
        imageUrl: `${this.publicBaseUrl}/${objectKey}`,
        imageKey: objectKey,
        rawImageUrl: input.rawImageUrl ?? sourceUrl,
        jobId: input.jobId ?? null,
      },
    });

    return this.serializeGeneration(generation);
  }

  async saveGenerationFromBuffer(input: SaveGenerationFromBufferInput) {
    if (!input.userId?.trim()) {
      throw new BadRequestException('User id is required');
    }

    if (!input.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }

    if (!input.imageBuffer || input.imageBuffer.length === 0) {
      throw new BadRequestException('Image buffer is required');
    }

    const processedBuffer = await this.normalizeImageBuffer(input.imageBuffer);

    const uniqueId = randomUUID();
    const objectKey = `ai-avatars/users/${input.userId}/${uniqueId}.webp`;

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    });

    await this.s3.send(uploadCommand);

    const generation = await this.prisma.aiAvatarGeneration.create({
      data: {
        userId: input.userId,
        prompt: input.prompt.trim(),
        imageUrl: `${this.publicBaseUrl}/${objectKey}`,
        imageKey: objectKey,
        rawImageUrl: input.rawImageUrl ?? null,
        jobId: input.jobId ?? null,
      },
    });

    return this.serializeGeneration(generation);
  }

  private async downloadImage(url: string) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new BadRequestException('Failed to download source image');
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('[AiAvatarGenerationsService] downloadImage failed', {
        url,
        error,
      });
      throw new InternalServerErrorException('Failed to download source image');
    }
  }

  private async normalizeImageBuffer(buffer: Buffer) {
    try {
      let image = sharp(buffer);
      const metadata = await image.metadata();

      const targetWidth = 1080;
      const targetHeight = 1620; // 2:3 aspect ratio
      const targetRatio = targetWidth / targetHeight;

      if (metadata.width && metadata.height) {
        const currentRatio = metadata.width / metadata.height;

        if (Math.abs(currentRatio - targetRatio) > 0.005) {
          let cropWidth = metadata.width;
          let cropHeight = Math.round(metadata.width / targetRatio);

          if (cropHeight > metadata.height) {
            cropHeight = metadata.height;
            cropWidth = Math.round(metadata.height * targetRatio);
          }

          image = image.extract({
            left: Math.floor((metadata.width - cropWidth) / 2),
            top: Math.floor((metadata.height - cropHeight) / 2),
            width: cropWidth,
            height: cropHeight,
          });
        }
      }

      return await image
        .resize(targetWidth, targetHeight, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({ quality: 90 })
        .toBuffer();
    } catch (error) {
      console.error(
        '[AiAvatarGenerationsService] normalizeImageBuffer failed',
        error,
      );
      throw new InternalServerErrorException(
        'Failed to process generated image',
      );
    }
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

  private serializeGeneration(generation: {
    id: string;
    prompt: string;
    imageUrl: string;
    rawImageUrl: string | null;
    createdAt: Date;
    jobId?: string | null;
  }) {
    return {
      id: generation.id,
      prompt: generation.prompt,
      imageUrl: generation.imageUrl,
      rawImageUrl: generation.rawImageUrl,
      createdAt: generation.createdAt.toISOString(),
      jobId: generation.jobId ?? null,
    };
  }
}
