// src/slideshow-library/slideshow-posts.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Express } from 'express';

@Injectable()
export class SlideshowPostsService {
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

  async createPost(data: {
    accountId: string;
    postId: string;
    caption?: string;
    likeCount?: number;
    viewCount?: number;
    commentCount?: number;
    shareCount?: number;
    publishedAt: Date;
    createdAt: Date;
    duration?: number;
    slides: Array<{
      slideIndex: number;
      imageUrl: string;
      textContent?: string;
      backgroundColor?: string;
      textPosition?: string;
      textColor?: string;
      fontSize?: number;
      duration?: number;
    }>;
  }) {
    return this.prisma.slideshowPost.create({
      data: {
        ...data,
        slideCount: data.slides.length,
        slides: {
          create: data.slides,
        },
      },
      include: {
        slides: true,
        account: true,
      },
    });
  }

  async getPostsByAccount(accountId: string, limit = 20) {
    return this.prisma.slideshowPost.findMany({
      where: { accountId, isActive: true },
      include: { slides: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getAllPosts(limit = 50) {
    return this.prisma.slideshowPost.findMany({
      where: { isActive: true },
      include: {
        slides: true,
        account: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getPostById(id: string) {
    return this.prisma.slideshowPost.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: { slideIndex: 'asc' },
        },
        account: true,
      },
    });
  }

  async updateSlideOrder(postId: string, slideIds: string[]) {
    if (!slideIds || slideIds.length === 0) {
      throw new BadRequestException('Slide order cannot be empty');
    }

    const slides = await this.prisma.slideshowSlide.findMany({
      where: { postId },
    });

    if (slides.length === 0) {
      throw new BadRequestException('Post not found or contains no slides');
    }

    if (slides.length !== slideIds.length) {
      throw new BadRequestException('Slide list does not match existing slides');
    }

    const idsFromPost = new Set(slides.map((slide) => slide.id));
    const providedIds = new Set(slideIds);

    if (providedIds.size !== slideIds.length) {
      throw new BadRequestException('Slide order contains duplicate slide ids');
    }

    for (const slideId of slideIds) {
      if (!idsFromPost.has(slideId)) {
        throw new BadRequestException('Slide does not belong to this post');
      }
    }

    await this.prisma.$transaction(async (tx) => {
      const offset = slideIds.length;

      for (const [index, slideId] of slideIds.entries()) {
        await tx.slideshowSlide.update({
          where: { id: slideId },
          data: { slideIndex: index + offset },
        });
      }

      for (const [index, slideId] of slideIds.entries()) {
        await tx.slideshowSlide.update({
          where: { id: slideId },
          data: { slideIndex: index },
        });
      }

      await tx.slideshowPost.update({
        where: { id: postId },
        data: { slideCount: slideIds.length },
      });
    });

    return this.getPostById(postId);
  }

  async updatePostStats(
    postId: string,
    stats: {
      likeCount?: number;
      viewCount?: number;
      commentCount?: number;
      shareCount?: number;
    },
  ) {
    return this.prisma.slideshowPost.update({
      where: { postId },
      data: {
        ...stats,
        lastSyncedAt: new Date(),
      },
    });
  }

  async uploadSlides(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadedSlides = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const extension =
        file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg';
      const uniqueId = randomUUID();
      const filename = `${Date.now()}_${uniqueId}.${extension}`;
      const s3Key = `slideshow-library/posts/${filename}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3.send(uploadCommand);

      uploadedSlides.push({
        url: `${this.publicBaseUrl}/${s3Key}`,
        filename,
        mimeType: file.mimetype,
        size: file.size,
      });
    }

    return uploadedSlides;
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
      throw new Error(`${name} environment variable is not configured`);
    }
    return value;
  }
}
