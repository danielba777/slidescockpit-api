import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PresignParams {
  key: string;
  contentType?: string;
  expiresInSec?: number;
}

@Injectable()
export class FilesService {
  private readonly bucket = process.env.HCLOUD_S3_BUCKET ?? 'slidescockpit-files';
  private readonly publicBaseUrl = process.env.HCLOUD_S3_PUBLIC_BASE_URL ?? 'https://files.slidescockpit.com';

  private readonly s3 = new S3Client({
    region: process.env.HCLOUD_S3_REGION ?? 'nbg1',
    endpoint: process.env.HCLOUD_S3_ENDPOINT ?? 'https://nbg1.your-objectstorage.com',
    forcePathStyle: false,
    credentials: {
      accessKeyId: this.requireEnv('HCLOUD_S3_KEY'),
      secretAccessKey: this.requireEnv('HCLOUD_S3_SECRET'),
    },
  });

  async createUploadUrl(params: PresignParams) {
    const { key, contentType = 'application/octet-stream', expiresInSec = 900 } = params;
    const normalizedKey = this.normalizeKey(key);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: normalizedKey,
      ContentType: contentType,
      ACL: 'private',
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: expiresInSec });
    const publicUrl = `${this.publicBaseUrl}/${encodeURI(normalizedKey)}`;

    return {
      uploadUrl,
      publicUrl,
      expiresIn: expiresInSec,
    };
  }

  private normalizeKey(key: string): string {
    if (!key || key.trim().length === 0) {
      throw new InternalServerErrorException('Invalid file key');
    }

    const cleaned = key.trim().replace(/\\/g, '/');
    if (cleaned.startsWith('/')) {
      return cleaned.slice(1);
    }
    return cleaned;
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
      throw new InternalServerErrorException(`${name} environment variable is not configured`);
    }
    return value;
  }
}
