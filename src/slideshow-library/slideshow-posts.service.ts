// src/slideshow-library/slideshow-posts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlideshowPostsService {
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
}
