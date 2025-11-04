// src/slideshow-library/slideshow-accounts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Express } from 'express';

@Injectable()
export class SlideshowAccountsService {
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

  async deleteAccount(id: string) {
    return this.prisma.slideshowAccount.delete({
      where: { id },
    });
  }

  async uploadProfileImage(file: Express.Multer.File) {
    if (!file) {
      return null;
    }

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${Date.now()}_${randomUUID()}.${extension}`;
    const s3Key = `slideshow-library/accounts/${filename}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3.send(uploadCommand);

    return `${this.publicBaseUrl}/${s3Key}`;
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
      throw new Error(`${name} environment variable is not configured`);
    }
    return value;
  }
}
