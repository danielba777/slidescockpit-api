import { Injectable } from '@nestjs/common';
import {
  S3Client,
  ListObjectsV2Command,
  _Object as S3Object,
} from '@aws-sdk/client-s3';

@Injectable()
export class SoundsService {
  private readonly bucket =
    process.env.HCLOUD_S3_BUCKET ?? 'slidescockpit-files';
  private readonly publicBaseUrl =
    process.env.HCLOUD_S3_PUBLIC_BASE_URL ?? 'https://files.slidescockpit.com';
  private readonly prefix = 'ugc/sounds/';

  private readonly s3 = new S3Client({
    region: process.env.HCLOUD_S3_REGION ?? 'nbg1',
    endpoint:
      process.env.HCLOUD_S3_ENDPOINT ?? 'https://nbg1.your-objectstorage.com',
    forcePathStyle: false,
    credentials: {
      accessKeyId: process.env.HCLOUD_S3_KEY ?? '',
      secretAccessKey: process.env.HCLOUD_S3_SECRET ?? '',
    },
  });

  async list(): Promise<
    {
      key: string;
      name: string;
      url: string;
      size?: number;
      coverUrl?: string | null;
    }[]
  > {
    const objects: S3Object[] = [];
    let ContinuationToken: string | undefined = undefined;
    do {
      const res = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: this.prefix,
          ContinuationToken,
        }),
      );
      if (res.Contents?.length) objects.push(...res.Contents);
      ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // Mappe Cover-Dateien zu ihrer Audio-Basis
    const isCover = (k: string) => /\.cover\.(png|jpe?g|webp|gif|avif)$/i.test(k);
    const isAudio = (k: string) =>
      /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(k) && !isCover(k);

    const toKey = (o: S3Object) => o.Key ?? '';
    const covers = new Map<string, string>(); // base -> coverKey
    for (const o of objects) {
      const key = toKey(o);
      if (key && isCover(key)) {
        const base = key.replace(/\.cover\.(png|jpe?g|webp|gif|avif)$/i, '');
        covers.set(base, key);
      }
    }

    const items: {
      key: string;
      name: string;
      url: string;
      size?: number;
      coverUrl?: string | null;
    }[] = [];

    for (const o of objects) {
      const key = toKey(o);
      if (!key || !isAudio(key)) continue;
      const url = `${this.publicBaseUrl}/${encodeURI(key)}`;
      const coverKey = covers.get(key);
      const coverUrl = coverKey
        ? `${this.publicBaseUrl}/${encodeURI(coverKey)}`
        : null;
      const name = key.substring(this.prefix.length);
      items.push({
        key,
        name,
        url,
        size: o.Size,
        coverUrl,
      });
    }

    // sortiere nach Key (neuere / datumsbasierte Namen werden i.d.R. zuletzt)
    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }
}