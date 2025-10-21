// src/slideshow-library/slideshow-accounts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlideshowAccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(data: {
    username: string;
    displayName: string;
    bio?: string;
    profileImageUrl?: string;
    followerCount?: number;
    followingCount?: number;
    isVerified?: boolean;
  }) {
    return this.prisma.slideshowAccount.create({ data });
  }

  async getAllAccounts(includePosts = false) {
    return this.prisma.slideshowAccount.findMany({
      include: {
        posts: includePosts
          ? {
              include: { slides: true },
              orderBy: { publishedAt: 'desc' },
              take: 10,
            }
          : false,
        _count: { select: { posts: true } },
      },
      orderBy: { followerCount: 'desc' },
    });
  }

  async getAccountById(id: string) {
    return this.prisma.slideshowAccount.findUnique({
      where: { id },
      include: {
        posts: {
          include: { slides: true },
          orderBy: { publishedAt: 'desc' },
        },
        _count: { select: { posts: true } },
      },
    });
  }

  async updateAccount(
    id: string,
    data: Partial<{
      displayName: string;
      bio: string;
      profileImageUrl: string;
      followerCount: number;
      followingCount: number;
      isVerified: boolean;
    }>,
  ) {
    return this.prisma.slideshowAccount.update({
      where: { id },
      data,
    });
  }

  async syncAccountData(id: string) {
    return this.prisma.slideshowAccount.update({
      where: { id },
      data: { lastSyncedAt: new Date() },
    });
  }
}
