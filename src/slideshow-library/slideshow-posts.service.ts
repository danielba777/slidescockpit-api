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
        slideCount: data.slides.length,
        slides: {
          create: data.slides.map((slide) => ({
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
