// src/slideshow-library/slideshow-posts.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Express } from 'express';
import sharp from 'sharp';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    categories?: string[];
    prompt?: string;
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
    const slidesWithHostedImages = await Promise.all(
      data.slides.map(async (slide) => ({
        ...slide,
        imageUrl: await this.ensureSlideImageHosted(slide.imageUrl),
      })),
    );

    try {
      const post = await this.prisma.slideshowPost.create({
        data: {
          accountId: data.accountId,
          postId: data.postId,
          caption: data.caption,
          categories: data.categories ?? [],
          prompt: data.prompt,
          likeCount: data.likeCount ?? 0,
          viewCount: data.viewCount ?? 0,
          commentCount: data.commentCount ?? 0,
          shareCount: data.shareCount ?? 0,
          publishedAt: data.publishedAt,
          createdAt: data.createdAt,
          duration: data.duration,
          slideCount: slidesWithHostedImages.length,
          slides: {
            create: slidesWithHostedImages.map((slide) => ({
              slideIndex: slide.slideIndex,
              imageUrl: slide.imageUrl,
              textContent: slide.textContent,
              backgroundColor: slide.backgroundColor,
              textPosition: slide.textPosition,
              textColor: slide.textColor,
              fontSize: slide.fontSize,
              duration: slide.duration,
            })),
          },
        },
        include: { slides: true },
      });

      return post;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A post with this identifier already exists',
        );
      }
      throw error;
    }
  }

  async getPostsByAccount(accountId: string, limit = 20) {
    return this.prisma.slideshowPost.findMany({
      where: { accountId, isActive: true },
      include: { slides: true, account: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getAllPosts(limit = 50, category?: string) {
    return this.prisma.slideshowPost.findMany({
      where: { 
        isActive: true,
        ...(category && { categories: { has: category } })
      },
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
        slides: { orderBy: { slideIndex: 'asc' } },
        account: true,
      },
    });
  }

  async getAllCategories() {
    const posts = await this.prisma.slideshowPost.findMany({
      where: { isActive: true },
      select: { categories: true },
    });

    const categoriesSet = new Set<string>();
    posts.forEach((post) => {
      post.categories.forEach((category) => categoriesSet.add(category));
    });

    return Array.from(categoriesSet).sort();
  }

  async uploadSlides(files: Express.Multer.File[]) {
    const uploadedUrls = await Promise.all(
      files.map((file) => this.uploadSlideImage(file)),
    );
    return uploadedUrls;
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
      where: { id: postId },
      data: stats,
      include: {
        slides: { orderBy: { slideIndex: 'asc' } },
        account: true,
      },
    });
  }

  async updateSlideOrder(postId: string, slideIds: string[]) {
    const updatePromises = slideIds.map((slideId, index) =>
      this.prisma.slideshowSlide.update({
        where: { id: slideId },
        data: { slideIndex: index },
      }),
    );

    await Promise.all(updatePromises);

    return this.getPostById(postId);
  }

  async updatePostPrompt(id: string, prompt: string | null) {
    return this.prisma.slideshowPost.update({
      where: { id },
      data: { prompt },
      include: {
        slides: { orderBy: { slideIndex: 'asc' } },
        account: true,
      },
    });
  }

  async updatePostCategories(id: string, categories: string[]) {
    return this.prisma.slideshowPost.update({
      where: { id },
      data: { categories },
      include: {
        slides: { orderBy: { slideIndex: 'asc' } },
        account: true,
      },
    });
  }

  async deletePost(id: string) {
    return this.prisma.slideshowPost.delete({
      where: { id },
    });
  }

  async updatePost(
    id: string,
    data: {
      caption?: string;
      categories?: string[];
      likeCount?: number;
      viewCount?: number;
      commentCount?: number;
      shareCount?: number;
      isActive?: boolean;
      prompt?: string;
    },
  ) {
    return this.prisma.slideshowPost.update({
      where: { id },
      data,
      include: {
        slides: { orderBy: { slideIndex: 'asc' } },
        account: true,
      },
    });
  }

  private async ensureSlideImageHosted(imageUrl: string): Promise<string> {
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new BadRequestException('Slide image URL is required');
    }

    if (imageUrl.startsWith(this.publicBaseUrl)) {
      return imageUrl;
    }

    try {
      const response = await fetch(imageUrl, {
        headers: {
          Accept:
            'image/avif,image/heic,image/heif,image/webp,image/png,image/jpeg;q=0.8,*/*;q=0.5',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
          Referer: 'https://www.tiktok.com/',
        },
      });

      if (!response.ok) {
        throw new BadRequestException(
          `Failed to download slide image: ${response.status} ${response.statusText}`,
        );
      }

      const contentTypeHeader = response.headers.get('Content-Type') ?? '';
      const normalizedContentType = contentTypeHeader.toLowerCase();

      const arrayBuffer = await response.arrayBuffer();
      const originalBuffer = Buffer.from(arrayBuffer);

      const uploadBuffer = async (
        buffer: Buffer,
        extension: string,
        contentType: string,
      ) => {
        const key = `slideshow-library/posts/${Date.now()}_${randomUUID()}.${extension}`;
        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read',
          }),
        );
        return `${this.publicBaseUrl}/${key}`;
      };

      const inferExtension = () => {
        if (normalizedContentType.includes('image/heic')) return 'heic';
        if (normalizedContentType.includes('image/heif')) return 'heif';
        if (normalizedContentType.includes('image/webp')) return 'webp';
        if (normalizedContentType.includes('image/png')) return 'png';
        if (normalizedContentType.includes('image/jpeg')) return 'jpg';
        if (normalizedContentType.includes('image/jpg')) return 'jpg';
        return 'bin';
      };

      if (
        normalizedContentType.includes('image/heic') ||
        normalizedContentType.includes('image/heif')
      ) {
        return await uploadBuffer(
          originalBuffer,
          inferExtension(),
          contentTypeHeader || 'image/heic',
        );
      }

      try {
        const image = sharp(originalBuffer, { failOn: 'none' }).rotate();
        const metadata = await image.metadata();
        const usePng = Boolean(metadata.hasAlpha);

        const processedBuffer = usePng
          ? await image.png({ compressionLevel: 9 }).toBuffer()
          : await image.jpeg({ quality: 90, mozjpeg: true }).toBuffer();

        const extension = usePng ? 'png' : 'jpg';
        const contentType = usePng ? 'image/png' : 'image/jpeg';

        return await uploadBuffer(processedBuffer, extension, contentType);
      } catch (processingError) {
        console.warn(
          '[SlideshowPostsService] Failed to convert image with sharp, falling back to original buffer',
          {
            imageUrl,
            error: processingError,
          },
        );

        return await uploadBuffer(
          originalBuffer,
          inferExtension(),
          contentTypeHeader || 'application/octet-stream',
        );
      }
    } catch (error) {
      console.error('[SlideshowPostsService] ensureSlideImageHosted failed', {
        imageUrl,
        error,
      });
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process slide image');
    }
  }

  async uploadSlideImage(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const key = `slideshow-slides/${randomUUID()}.${fileExtension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return `${this.publicBaseUrl}/${key}`;
  }

  async createPostWithUploadedImages(
    data: {
      accountId: string;
      postId: string;
      caption?: string;
      categories?: string[];
      prompt?: string;
      likeCount?: number;
      viewCount?: number;
      commentCount?: number;
      shareCount?: number;
      publishedAt: Date;
      createdAt: Date;
      duration?: number;
      slides: Array<{
        slideIndex: number;
        textContent?: string;
        backgroundColor?: string;
        textPosition?: string;
        textColor?: string;
        fontSize?: number;
        duration?: number;
      }>;
    },
    files: Express.Multer.File[],
  ) {
    if (files.length !== data.slides.length) {
      throw new BadRequestException(
        'Number of files must match number of slides',
      );
    }

    const uploadedUrls = await Promise.all(
      files.map((file) => this.uploadSlideImage(file)),
    );

    const slidesWithUrls = data.slides.map((slide, index) => ({
      ...slide,
      imageUrl: uploadedUrls[index],
    }));

    return this.createPost({
      ...data,
      slides: slidesWithUrls,
    });
  }

  private requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  }
}
