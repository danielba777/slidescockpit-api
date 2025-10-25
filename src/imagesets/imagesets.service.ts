// src/imagesets/imagesets.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesetsService {
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

  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async createImageSet(data: { name: string; parentId?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    return this.prisma.imageSet.create({
      data: {
        name: data.name,
        slug,
        parentId: data.parentId,
      },
    });
  }

  async getAllImageSets() {
    return this.prisma.imageSet.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        children: {
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            _count: {
              select: { images: true, children: true },
            },
          },
        },
        _count: {
          select: { images: true, children: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getImageSetById(id: string) {
    return this.prisma.imageSet.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        parent: true,
        children: {
          include: {
            _count: {
              select: { images: true, children: true },
            },
          },
        },
        _count: {
          select: { images: true, children: true },
        },
      },
    });
  }

  async uploadImagesToSet(imageSetId: string, files: Express.Multer.File[]) {
    const imageSet = await this.prisma.imageSet.findUnique({
      where: { id: imageSetId },
    });

    if (!imageSet) {
      throw new Error('ImageSet not found');
    }

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // ---------- Aspect Ratio 2:3 Logic START ----------
      let image = sharp(file.buffer);
      const metadata = await image.metadata();
      const targetRatio = 2 / 3;
      const targetWidth = 1080; // Canvas Standardbreite
      const targetHeight = 1620; // Canvas Standardhöhe (2:3 Ratio)

      if (metadata.width && metadata.height) {
        // Schritt 1: Crop auf 2:3 Aspect Ratio, falls nötig
        const currentRatio = metadata.width / metadata.height;
        if (Math.abs(currentRatio - targetRatio) > 0.01) {
          let resizeWidth = metadata.width;
          let resizeHeight = Math.round(metadata.width / targetRatio);
          if (resizeHeight > metadata.height) {
            resizeHeight = metadata.height;
            resizeWidth = Math.round(metadata.height * targetRatio);
          }
          image = image.extract({
            left: Math.floor((metadata.width - resizeWidth) / 2),
            top: Math.floor((metadata.height - resizeHeight) / 2),
            width: resizeWidth,
            height: resizeHeight,
          });
        }

        // Schritt 2: Skaliere auf Standardgröße (1080x1620)
        image = image.resize(targetWidth, targetHeight, {
          fit: 'cover',
          position: 'centre',
        });
      }

      const processedBuffer = await image.toBuffer();
      // ---------- Aspect Ratio 2:3 Logic ENDE ----------

      const fileExtension = file.originalname.split('.').pop();
      // Neuer Dateiname: slug + UUID + ext
      const filename = `${imageSet.slug}_${randomUUID()}.${fileExtension}`;
      const s3Key = `imagesets/${imageSet.slug}/${filename}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: processedBuffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3.send(uploadCommand);
      const imageUrl = `${this.publicBaseUrl}/${s3Key}`;
      const imageRecord = await this.prisma.imageSetImage.create({
        data: {
          imageSetId,
          filename,
          url: imageUrl,
          metadata: {
            size: processedBuffer.length,
            type: file.mimetype,
            uploadedAt: new Date().toISOString(),
          },
          order: i + 1,
        },
      });
      uploadedImages.push(imageRecord);
    }
    return uploadedImages;
  }

  async deleteImage(imageId: string) {
    const image = await this.prisma.imageSetImage.findUnique({
      where: { id: imageId },
      include: { imageSet: true },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    // Aus S3 löschen (nutzt bestehende Konfiguration)
    const s3Key = `imagesets/${image.imageSet.slug}/${image.filename}`;
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    await this.s3.send(deleteCommand);

    // Aus DB löschen
    await this.prisma.imageSetImage.delete({
      where: { id: imageId },
    });

    return { success: true };
  }

  async getRandomImageFromSet(imageSetId: string) {
    // Check if this imageSet has children
    const imageSet = await this.prisma.imageSet.findUnique({
      where: { id: imageSetId },
      include: {
        children: {
          select: { id: true },
        },
      },
    });

    if (!imageSet) {
      return null;
    }

    let imageSetIds = [imageSetId];

    // If the imageSet has children, collect images from all children
    if (imageSet.children && imageSet.children.length > 0) {
      const childIds = imageSet.children.map((child) => child.id);
      imageSetIds = [imageSetId, ...childIds];
    }

    // Get all images from the imageSet and its children
    const images = await this.prisma.imageSetImage.findMany({
      where: {
        imageSetId: {
          in: imageSetIds,
        },
      },
      orderBy: { order: 'asc' },
    });

    if (images.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }

  async updateImageSet(
    id: string,
    data: {
      name?: string;
      isActive?: boolean;
      parentId?: string;
    },
  ) {
    const updateData: any = { ...data };

    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    return this.prisma.imageSet.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteImageSet(id: string) {
    const imageSet = await this.prisma.imageSet.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!imageSet) {
      throw new Error('ImageSet not found');
    }

    // Alle Bilder aus S3 löschen (nutzt bestehende Konfiguration)
    for (const image of imageSet.images) {
      const s3Key = `imagesets/${imageSet.slug}/${image.filename}`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      });
      await this.s3.send(deleteCommand);
    }

    // ImageSet aus DB löschen (Cascade löscht auch die Bilder)
    await this.prisma.imageSet.delete({
      where: { id },
    });

    return { success: true };
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
