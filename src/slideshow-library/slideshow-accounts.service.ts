// src/slideshow-library/slideshow-accounts.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Express } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SlideshowAccountsService {
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
    try {
      return await this.prisma.slideshowAccount.create({ data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this username already exists',
        );
      }
      throw error;
    }
  }

  async findOrCreateAccount(data: {
    username: string;
    displayName: string;
    bio?: string;
    profileImageUrl?: string;
    followerCount?: number;
    followingCount?: number;
    isVerified?: boolean;
  }) {
    try {
      // First try to find existing account
      const existingAccount = await this.prisma.slideshowAccount.findUnique({
        where: { username: data.username.toLowerCase() },
      });

      if (existingAccount) {
        // Update existing account with latest data
        return await this.prisma.slideshowAccount.update({
          where: { id: existingAccount.id },
          data: {
            displayName: data.displayName,
            bio: data.bio,
            profileImageUrl: data.profileImageUrl,
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            isVerified: data.isVerified,
            lastSyncedAt: new Date(),
          },
        });
      }

      // Create new account if not found
      return await this.prisma.slideshowAccount.create({
        data: {
          ...data,
          username: data.username.toLowerCase(),
          lastSyncedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
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
