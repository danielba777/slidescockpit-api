# .prettierrc

```
{
  "singleQuote": true,
  "trailingComma": "all"
}

```

# eslint.config.mjs

```mjs
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
```

# nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}

```

# package.json

```json
{
  "name": "nest-typescript-starter",
  "private": true,
  "version": "1.0.0",
  "description": "Nest TypeScript starter repository",
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/jest/bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "engines": {
    "npm": ">=10.0.0",
    "node": ">=20.0.0"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.679.0",
    "@aws-sdk/s3-request-presigner": "^3.679.0",
    "@nestjs/common": "^11.0.17",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.1.7",
    "@prisma/client": "^6.17.1",
    "bullmq": "^5.61.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "dotenv": "^17.2.3",
    "ioredis": "^5.8.1",
    "prisma": "^6.17.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "sharp": "^0.34.4"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.10.8",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/multer": "^2.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.3",
    "globals": "^15.14.0",
    "jest": "^29.7.0",
    "prettier": "^3.4.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@nestjs/core",
      "@swc/core"
    ]
  }
}

```

# prisma\migrations\20251019195929_init\migration.sql

```sql
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('QUEUE', 'SCHEDULED', 'RUNNING', 'PUBLISHED', 'INBOX', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openId" TEXT NOT NULL,
    "displayName" TEXT,
    "username" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "refreshExpiresAt" TIMESTAMP(3),
    "scope" JSONB NOT NULL,
    "timezoneOffsetMinutes" INTEGER,
    "connectedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "targetOpenId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'SCHEDULED',
    "runAt" TIMESTAMP(3) NOT NULL,
    "jobId" TEXT,
    "publishId" TEXT,
    "resultUrl" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEvent" (
    "id" TEXT NOT NULL,
    "scheduledPostId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_userId_openId_key" ON "TikTokAccount"("userId", "openId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledPost_idempotencyKey_key" ON "ScheduledPost"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PostEvent_scheduledPostId_idx" ON "PostEvent"("scheduledPostId");

-- AddForeignKey
ALTER TABLE "TikTokAccount" ADD CONSTRAINT "TikTokAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPost" ADD CONSTRAINT "ScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

```

# prisma\migrations\20251019200855_init\migration.sql

```sql
/*
  Warnings:

  - The `scope` column on the `TikTokAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TikTokAccount" ADD COLUMN     "unionId" TEXT,
DROP COLUMN "scope",
ADD COLUMN     "scope" TEXT[];

```

# prisma\migrations\20251021120117_add_imagesets\migration.sql

```sql
-- CreateTable
CREATE TABLE "ImageSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageSetImage" (
    "id" TEXT NOT NULL,
    "imageSetId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageSetImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageSet_slug_key" ON "ImageSet"("slug");

-- CreateIndex
CREATE INDEX "ImageSet_slug_idx" ON "ImageSet"("slug");

-- CreateIndex
CREATE INDEX "ImageSet_category_idx" ON "ImageSet"("category");

-- CreateIndex
CREATE INDEX "ImageSet_isActive_idx" ON "ImageSet"("isActive");

-- CreateIndex
CREATE INDEX "ImageSetImage_imageSetId_idx" ON "ImageSetImage"("imageSetId");

-- CreateIndex
CREATE INDEX "ImageSetImage_order_idx" ON "ImageSetImage"("order");

-- AddForeignKey
ALTER TABLE "ImageSetImage" ADD CONSTRAINT "ImageSetImage_imageSetId_fkey" FOREIGN KEY ("imageSetId") REFERENCES "ImageSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

# prisma\migrations\20251021182628_add_slideshow_library\migration.sql

```sql
-- CreateTable
CREATE TABLE "SlideshowAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlideshowAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideshowPost" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "caption" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "slideCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlideshowPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideshowSlide" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "duration" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "textContent" TEXT,
    "backgroundColor" TEXT,
    "textPosition" TEXT,
    "textColor" TEXT,
    "fontSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlideshowSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowAccount_username_key" ON "SlideshowAccount"("username");

-- CreateIndex
CREATE INDEX "SlideshowAccount_username_idx" ON "SlideshowAccount"("username");

-- CreateIndex
CREATE INDEX "SlideshowAccount_isActive_idx" ON "SlideshowAccount"("isActive");

-- CreateIndex
CREATE INDEX "SlideshowAccount_lastSyncedAt_idx" ON "SlideshowAccount"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowPost_postId_key" ON "SlideshowPost"("postId");

-- CreateIndex
CREATE INDEX "SlideshowPost_accountId_idx" ON "SlideshowPost"("accountId");

-- CreateIndex
CREATE INDEX "SlideshowPost_postId_idx" ON "SlideshowPost"("postId");

-- CreateIndex
CREATE INDEX "SlideshowPost_isActive_idx" ON "SlideshowPost"("isActive");

-- CreateIndex
CREATE INDEX "SlideshowPost_publishedAt_idx" ON "SlideshowPost"("publishedAt");

-- CreateIndex
CREATE INDEX "SlideshowPost_lastSyncedAt_idx" ON "SlideshowPost"("lastSyncedAt");

-- CreateIndex
CREATE INDEX "SlideshowSlide_postId_idx" ON "SlideshowSlide"("postId");

-- CreateIndex
CREATE INDEX "SlideshowSlide_slideIndex_idx" ON "SlideshowSlide"("slideIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowSlide_postId_slideIndex_key" ON "SlideshowSlide"("postId", "slideIndex");

-- AddForeignKey
ALTER TABLE "SlideshowPost" ADD CONSTRAINT "SlideshowPost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "SlideshowAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideshowSlide" ADD CONSTRAINT "SlideshowSlide_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SlideshowPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

# prisma\migrations\20251022210828_add_slideshow_prompt\migration.sql

```sql
-- AlterTable
ALTER TABLE "SlideshowPost" ADD COLUMN     "prompt" TEXT;

```

# prisma\migrations\20251025175954_add_imageset_hierarchy\migration.sql

```sql
-- AlterTable
ALTER TABLE "ImageSet" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "ImageSet_parentId_idx" ON "ImageSet"("parentId");

-- AddForeignKey
ALTER TABLE "ImageSet" ADD CONSTRAINT "ImageSet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ImageSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;


```

# prisma\migrations\20251025180000_remove_description_category\migration.sql

```sql
-- DropIndex
DROP INDEX "ImageSet_category_idx";

-- AlterTable
ALTER TABLE "ImageSet" DROP COLUMN "description",
DROP COLUMN "category";


```

# prisma\migrations\20251101000000_add_ai_avatar_templates\migration.sql

```sql
-- CreateTable
CREATE TABLE "AiAvatarTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAvatarTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiAvatarTemplate_slug_key" ON "AiAvatarTemplate"("slug");

-- CreateIndex
CREATE INDEX "AiAvatarTemplate_isActive_idx" ON "AiAvatarTemplate"("isActive");

-- CreateIndex
CREATE INDEX "AiAvatarTemplate_createdAt_idx" ON "AiAvatarTemplate"("createdAt");

```

# prisma\migrations\20251101010000_remove_template_name\migration.sql

```sql
-- Drop indexes referencing slug/name
DROP INDEX IF EXISTS "AiAvatarTemplate_slug_key";

ALTER TABLE "AiAvatarTemplate"
  DROP COLUMN IF EXISTS "name",
  DROP COLUMN IF EXISTS "slug";

```

# prisma\migrations\migration_lock.toml

```toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"

```

# prisma\schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String          @id
  email     String?
  provider  String?
  createdAt DateTime        @default(now())
  posts     ScheduledPost[]
  accounts  TikTokAccount[]
}

model TikTokAccount {
  id                    String    @id @default(uuid())
  userId                String
  openId                String
  displayName           String?
  username              String?
  avatarUrl             String?
  accessToken           String
  refreshToken          String?
  expiresAt             DateTime
  refreshExpiresAt      DateTime?
  timezoneOffsetMinutes Int?
  connectedAt           DateTime
  updatedAt             DateTime
  unionId               String?
  scope                 String[]
  user                  User      @relation(fields: [userId], references: [id])

  @@unique([userId, openId])
}

model ScheduledPost {
  id             String      @id @default(uuid())
  userId         String
  platform       String
  targetOpenId   String
  payload        Json
  status         PostStatus  @default(SCHEDULED)
  runAt          DateTime
  jobId          String?
  publishId      String?
  resultUrl      String?
  attempts       Int         @default(0)
  lastError      String?
  idempotencyKey String      @unique
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  events         PostEvent[] @relation("ScheduledPostEvents")
  user           User        @relation(fields: [userId], references: [id])
}

model PostEvent {
  id              String        @id @default(uuid())
  scheduledPostId String
  type            String
  data            Json?
  occurredAt      DateTime      @default(now())
  post            ScheduledPost @relation("ScheduledPostEvents", fields: [scheduledPostId], references: [id])

  @@index([scheduledPostId])
}

model ImageSet {
  id          String          @id @default(cuid())
  name        String
  slug        String          @unique
  isActive    Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  parentId    String?
  parent      ImageSet?       @relation("ImageSetHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    ImageSet[]      @relation("ImageSetHierarchy")
  images      ImageSetImage[]

  @@index([slug])
  @@index([isActive])
  @@index([parentId])
}

model ImageSetImage {
  id         String   @id @default(cuid())
  imageSetId String
  filename   String
  url        String
  metadata   Json?
  order      Int      @default(0)
  createdAt  DateTime @default(now())
  imageSet   ImageSet @relation(fields: [imageSetId], references: [id], onDelete: Cascade)

  @@index([imageSetId])
  @@index([order])
}

model AiAvatarTemplate {
  id        String   @id @default(cuid())
  prompt    String   @db.Text
  imageUrl  String
  imageKey  String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isActive])
  @@index([createdAt])
}

model SlideshowAccount {
  id              String          @id @default(cuid())
  username        String          @unique
  displayName     String
  bio             String?
  profileImageUrl String?
  followerCount   Int             @default(0)
  followingCount  Int             @default(0)
  isVerified      Boolean         @default(false)
  isActive        Boolean         @default(true)
  lastSyncedAt    DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  posts           SlideshowPost[]

  @@index([username])
  @@index([isActive])
  @@index([lastSyncedAt])
}

model SlideshowPost {
  id           String           @id @default(cuid())
  accountId    String
  postId       String           @unique
  caption      String?
  likeCount    Int              @default(0)
  viewCount    Int              @default(0)
  commentCount Int              @default(0)
  shareCount   Int              @default(0)
  createdAt    DateTime
  publishedAt  DateTime
  duration     Int?
  slideCount   Int              @default(0)
  isActive     Boolean          @default(true)
  lastSyncedAt DateTime         @default(now())
  syncedAt     DateTime         @default(now())
  prompt       String?
  account      SlideshowAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  slides       SlideshowSlide[]

  @@index([accountId])
  @@index([postId])
  @@index([isActive])
  @@index([publishedAt])
  @@index([lastSyncedAt])
}

model SlideshowSlide {
  id              String        @id @default(cuid())
  postId          String
  slideIndex      Int
  duration        Int?
  imageUrl        String
  textContent     String?
  backgroundColor String?
  textPosition    String?
  textColor       String?
  fontSize        Int?
  createdAt       DateTime      @default(now())
  post            SlideshowPost @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, slideIndex])
  @@index([postId])
  @@index([slideIndex])
}

enum PostStatus {
  QUEUE
  SCHEDULED
  RUNNING
  PUBLISHED
  INBOX
  FAILED
  CANCELLED
}

```

# README.md

```md
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

\`\`\`bash
$ npm install
\`\`\`

## Compile and run the project

\`\`\`bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
\`\`\`

## Run tests

\`\`\`bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
\`\`\`

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

\`\`\`bash
$ npm install -g @nestjs/mau
$ mau deploy
\`\`\`

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```

# src\ai-avatars\ai-avatar-templates.controller.ts

```ts
// src/ai-avatars/ai-avatar-templates.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AiAvatarTemplatesService } from './ai-avatar-templates.service';

@Controller('ai-avatars')
export class AiAvatarTemplatesController {
  constructor(
    private readonly templatesService: AiAvatarTemplatesService,
  ) {}

  @Get('templates')
  listTemplates() {
    return this.templatesService.listTemplates();
  }

  @Post('templates')
  createTemplate(
    @Body()
    body: {
      prompt: string;
      imageUrl: string;
      imageKey: string;
    },
  ) {
    return this.templatesService.createTemplate(body);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Template id is required');
    }
    return this.templatesService.deleteTemplate(id);
  }

  @Post('templates/upload-image')
  @UseInterceptors(FilesInterceptor('image', 1))
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    const file = files?.[0];
    if (!file) {
      throw new BadRequestException('No image uploaded');
    }
    return this.templatesService.uploadTemplateImage(file);
  }
}

```

# src\ai-avatars\ai-avatar-templates.module.ts

```ts
// src/ai-avatars/ai-avatar-templates.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiAvatarTemplatesService } from './ai-avatar-templates.service';
import { AiAvatarTemplatesController } from './ai-avatar-templates.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AiAvatarTemplatesController],
  providers: [AiAvatarTemplatesService],
  exports: [AiAvatarTemplatesService],
})
export class AiAvatarTemplatesModule {}

```

# src\ai-avatars\ai-avatar-templates.service.ts

```ts
// src/ai-avatars/ai-avatar-templates.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { Express } from 'express';

interface CreateTemplateInput {
  prompt: string;
  imageUrl: string;
  imageKey: string;
}

@Injectable()
export class AiAvatarTemplatesService {
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

  async listTemplates() {
    return this.prisma.aiAvatarTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(input: CreateTemplateInput) {
    if (!input.prompt?.trim()) {
      throw new BadRequestException('Prompt is required');
    }
    if (!input.imageUrl || !input.imageKey) {
      throw new BadRequestException('Image information missing');
    }

    return this.prisma.aiAvatarTemplate.create({
      data: {
        prompt: input.prompt.trim(),
        imageUrl: input.imageUrl,
        imageKey: input.imageKey,
      },
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.prisma.aiAvatarTemplate.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: template.imageKey,
    });

    try {
      await this.s3.send(deleteCommand);
    } catch (error) {
      console.error('Failed to delete template image', error);
    }

    await this.prisma.aiAvatarTemplate.delete({ where: { id } });
    return { success: true };
  }

  async uploadTemplateImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string; contentType: string }> {
    if (!file) {
      throw new BadRequestException('Image file missing');
    }

    const uniqueId = randomUUID();
    const key = `ai-avatars/templates/${uniqueId}.webp`;

    const processedBuffer = await sharp(file.buffer)
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'centre',
      })
      .webp({ quality: 90 })
      .toBuffer();

    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/webp',
      ACL: 'public-read',
    });

    await this.s3.send(uploadCommand);

    return {
      url: `${this.publicBaseUrl}/${key}`,
      key,
      contentType: 'image/webp',
    };
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

```

# src\app.controller.spec.ts

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

```

# src\app.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

# src\app.module.ts

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ImagesetsModule } from './imagesets/imagesets.module';
import { SlideshowLibraryModule } from './slideshow-library/slideshow-library.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { AiAvatarTemplatesModule } from './ai-avatars/ai-avatar-templates.module';

@Module({
  imports: [
    AuthModule,
    TikTokModule,
    FilesModule,
    ImagesetsModule,
    SlideshowLibraryModule,
    PrismaModule,
    QueueModule,
    AiAvatarTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

# src\app.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

# src\auth\auth.controller.ts

```ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { SessionService } from '../common/session/session.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, session } = this.authService.login(dto);

    res.cookie(this.sessionService.getSessionCookieName(), session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.sessionService.getSessionTtlMs(),
      expires: new Date(session.expiresAt),
    });

    return {
      id: user.id,
      email: user.email,
      provider: user.provider,
      sessionExpiresAt: session.expiresAt,
    };
  }
}

```

# src\auth\auth.module.ts

```ts
import { Module } from '@nestjs/common';

import { SessionModule } from '../common/session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}


```

# src\auth\auth.service.ts

```ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';

import { SessionData, SessionService, SessionUser } from '../common/session/session.service';
import { LoginDto } from './dto/login.dto';

interface LoginResult {
  user: SessionUser;
  session: SessionData;
}

@Injectable()
export class AuthService {
  constructor(private readonly sessionService: SessionService) {}

  login(dto: LoginDto): LoginResult {
    const configuredEmail = process.env.POSTIZ_EMAIL;
    const configuredPassword = process.env.POSTIZ_PASSWORD;
    const configuredProvider = process.env.POSTIZ_PROVIDER;

    if (!configuredEmail) {
      throw new InternalServerErrorException('POSTIZ_EMAIL is not configured');
    }
    if (!configuredPassword) {
      throw new InternalServerErrorException('POSTIZ_PASSWORD is not configured');
    }
    if (!configuredProvider) {
      throw new InternalServerErrorException('POSTIZ_PROVIDER is not configured');
    }

    const matchesEmail = dto.email.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
    const matchesPassword = dto.password === configuredPassword;
    const matchesProvider = dto.provider.trim().toLowerCase() === configuredProvider.trim().toLowerCase();

    if (!matchesEmail || !matchesPassword || !matchesProvider) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const user: SessionUser = {
      id: this.buildUserId(configuredEmail),
      email: configuredEmail,
      provider: configuredProvider,
    };

    const session = this.sessionService.createSession(user);
    return { user, session };
  }

  private buildUserId(email: string): string {
    const digest = createHash('sha256').update(email).digest('hex');
    return `user_${digest.slice(0, 24)}`;
  }
}


```

# src\auth\dto\login.dto.ts

```ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  provider!: string;
}


```

# src\common\session\session.module.ts

```ts
import { Global, Module } from '@nestjs/common';

import { SessionService } from './session.service';

@Global()
@Module({
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}


```

# src\common\session\session.service.ts

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { randomBytes, randomUUID } from 'node:crypto';

export interface SessionUser {
  id: string;
  email: string;
  provider: string;
}

export interface SessionData {
  id: string;
  token: string;
  user: SessionUser;
  createdAt: string;
  expiresAt: string;
}

interface PendingState {
  sessionId: string;
  state: string;
  codeVerifier: string;
  createdAt: number;
  expiresAt: number;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, SessionData>();
  private readonly pendingStates = new Map<string, PendingState>();
  private readonly sessionCookieName = 'postiz_auth';
  private readonly sessionTtlMs = 1000 * 60 * 60 * 12; // 12 hours
  private readonly stateTtlMs = 1000 * 60 * 5; // 5 minutes
  
  createSession(user: SessionUser): SessionData {
    const token = randomUUID();
    const id = randomUUID();
    const createdAt = Date.now();
    const expiresAt = createdAt + this.sessionTtlMs;

    const session: SessionData = {
      id,
      token,
      user,
      createdAt: new Date(createdAt).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
    };

    this.sessions.set(token, session);
    return session;
  }

  getSessionCookieName(): string {
    return this.sessionCookieName;
  }

  getSessionTtlMs(): number {
    return this.sessionTtlMs;
  }

  getSession(token: string): SessionData | undefined {
    const session = this.sessions.get(token);
    if (!session) {
      return undefined;
    }

    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.sessions.delete(token);
      return undefined;
    }

    return session;
  }

  touchSession(token: string): void {
    const session = this.getSession(token);
    if (!session) {
      return;
    }

    const now = Date.now();
    session.expiresAt = new Date(now + this.sessionTtlMs).toISOString();
  }

  invalidateSession(token: string): void {
    this.sessions.delete(token);
  }

  requireSessionFromRequest(req: Request): SessionData {
    const token = this.extractTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException('Missing session');
    }

    const session = this.getSession(token);
    if (!session) {
      throw new UnauthorizedException('Session expired');
    }

    this.touchSession(token);
    return session;
  }

  registerState(sessionId: string): PendingState {
    const state = randomBytes(16).toString('hex');
    const codeVerifier = this.generateCodeVerifier();
    const createdAt = Date.now();
    const expiresAt = createdAt + this.stateTtlMs;
    const pending: PendingState = {
      sessionId,
      state,
      codeVerifier,
      createdAt,
      expiresAt,
    };

    this.pendingStates.set(state, pending);
    return pending;
  }

  consumeState(sessionId: string, state: string): PendingState {
    const pending = this.pendingStates.get(state);
    this.pendingStates.delete(state);

    if (!pending) {
      throw new UnauthorizedException('Unknown TikTok state');
    }

    if (pending.sessionId !== sessionId) {
      throw new UnauthorizedException('State does not belong to session');
    }

    if (pending.expiresAt <= Date.now()) {
      throw new UnauthorizedException('State expired');
    }

    return pending;
  }

  private extractTokenFromRequest(req: Request): string | undefined {
    const header = req.headers.cookie;
    if (!header) {
      return undefined;
    }

    const cookies = header
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => entry.split('='))
      .reduce<Record<string, string>>((acc, [key, ...valueParts]) => {
        if (key) {
          acc[key] = valueParts.join('=');
        }
        return acc;
      }, {});

    return cookies[this.sessionCookieName];
  }

  private generateCodeVerifier(): string {
    // 32 bytes => 43 character base64url string, within recommended 43-128 range
    return randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
}

```

# src\files\dto\presign-request.dto.ts

```ts
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class PresignRequestDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(3600)
  expiresInSec?: number;
}

```

# src\files\files.controller.ts

```ts
import { Controller, Get, Query } from '@nestjs/common';

import { PresignRequestDto } from './dto/presign-request.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('presign')
  async presign(@Query() query: PresignRequestDto) {
    return this.filesService.createUploadUrl({
      key: query.key,
      contentType: query.contentType,
      expiresInSec: query.expiresInSec,
    });
  }
}

```

# src\files\files.module.ts

```ts
import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

```

# src\files\files.service.ts

```ts
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

```

# src\imagesets\imagesets.controller.ts

```ts
// src/imagesets/imagesets.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesetsService } from './imagesets.service';

@Controller('imagesets')
export class ImagesetsController {
  constructor(private readonly imagesetsService: ImagesetsService) {}

  @Get()
  async getAllImageSets() {
    return this.imagesetsService.getAllImageSets();
  }

  @Get(':id')
  async getImageSetById(@Param('id') id: string) {
    return this.imagesetsService.getImageSetById(id);
  }

  @Post()
  async createImageSet(
    @Body() data: { name: string; description?: string; category: string },
  ) {
    return this.imagesetsService.createImageSet(data);
  }

  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('images', 20)) // Max 20 Bilder
  async uploadImages(
    @Param('id') imageSetId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesetsService.uploadImagesToSet(imageSetId, files);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 20))
  async uploadOriginalImages(
    @Param('id') imageSetId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesetsService.uploadOriginalImagesToSet(imageSetId, files);
  }


  @Get(':id/random-image')
  async getRandomImage(@Param('id') imageSetId: string) {
    const image = await this.imagesetsService.getRandomImageFromSet(imageSetId);
    if (!image) {
      return { success: false, error: 'No images found in this set' };
    }
    return { success: true, imageUrl: image.url };
  }

  @Put(':id')
  async updateImageSet(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      description?: string;
      category?: string;
      isActive?: boolean;
    },
  ) {
    return this.imagesetsService.updateImageSet(id, data);
  }

  @Delete(':id')
  async deleteImageSet(@Param('id') id: string) {
    return this.imagesetsService.deleteImageSet(id);
  }

  @Delete('images/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    return this.imagesetsService.deleteImage(imageId);
  }
}

```

# src\imagesets\imagesets.module.ts

```ts
import { Module } from '@nestjs/common';
import { ImagesetsController } from './imagesets.controller';
import { ImagesetsService } from './imagesets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [ImagesetsController],
  providers: [ImagesetsService],
  exports: [ImagesetsService],
})
export class ImagesetsModule {}

```

# src\imagesets\imagesets.service.ts

```ts
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


  async uploadOriginalImagesToSet(
    imageSetId: string,
    files: Express.Multer.File[],
  ) {
    const imageSet = await this.prisma.imageSet.findUnique({
      where: { id: imageSetId },
    });
    if (!imageSet) {
      throw new Error('ImageSet not found');
    }

    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = (file.originalname.split('.').pop() || 'bin').toLowerCase();
      const filename = `${imageSet.slug}_${randomUUID()}.${fileExtension}`;
      const s3Key = `imagesets/${imageSet.slug}/original/${filename}`;

      // ⚠️ Kein sharp / keine Aspect-Ratio-Anpassung:
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
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
            size: file.buffer.length,
            type: file.mimetype || 'application/octet-stream',
            uploadedAt: new Date().toISOString(),
            original: true,
          },
          order: i + 1,
        },
      });
      uploadedImages.push(imageRecord);
    }
    return uploadedImages;
  }


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

```

# src\integrations\social\social.abstract.ts

```ts
import { Logger } from '@nestjs/common';

export class RefreshToken extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefreshToken';
  }
}

export class NotEnoughScopes extends Error {
  constructor(public readonly missingScopes: string[]) {
    super(`Missing required scopes: ${missingScopes.join(', ')}`);
    this.name = 'NotEnoughScopes';
  }
}

export class BadBody extends Error {
  constructor(
    public readonly code: string,
    public readonly payload: string,
    public readonly original?: Buffer,
    public readonly hint?: string,
  ) {
    super(hint ?? code);
    this.name = 'BadBody';
  }
}

export abstract class SocialAbstract {
  protected readonly logger = new Logger(SocialAbstract.name);

  protected async fetch(
    url: string,
    init: RequestInit,
    label?: string,
    attempt = 0,
  ): Promise<Response> {
    const response = await fetch(url, init);

    if (response.status === 429 && attempt < 3) {
      const retryAfter = Number(response.headers.get('retry-after')) || 1;
      await this.sleep(Math.max(retryAfter, attempt + 1) * 1000);
      return this.fetch(url, init, label, attempt + 1);
    }

    return response;
  }

  protected checkScopes(required: string[], granted: string[]): void {
    const grantedSet = new Set(granted.map((scope) => scope.trim()));
    const missing = required.filter((scope) => !grantedSet.has(scope));

    if (missing.length > 0) {
      throw new NotEnoughScopes(missing);
    }
  }

  protected async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

```

# src\integrations\tiktok\dto\connect-tiktok.dto.ts

```ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectTikTokDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}


```

# src\integrations\tiktok\dto\post-tiktok.dto.ts

```ts
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TikTokPostingSettingsDto {
  @IsOptional()
  @IsEnum(['DIRECT_POST', 'UPLOAD', 'MEDIA_UPLOAD', 'URL'])
  contentPostingMethod?: 'DIRECT_POST' | 'UPLOAD' | 'MEDIA_UPLOAD' | 'URL';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'FRIENDS', 'SELF_ONLY'])
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'SELF_ONLY';

  @IsOptional()
  @IsBoolean()
  duet?: boolean;

  @IsOptional()
  @IsBoolean()
  comment?: boolean;

  @IsOptional()
  @IsBoolean()
  stitch?: boolean;

  @IsOptional()
  @IsBoolean()
  videoMadeWithAi?: boolean;

  @IsOptional()
  @IsBoolean()
  brandContentToggle?: boolean;

  @IsOptional()
  @IsBoolean()
  brandOrganicToggle?: boolean;

  @IsOptional()
  @IsBoolean()
  autoAddMusic?: boolean;
}

export class TikTokMediaDto {
  @IsEnum(['video', 'photo'])
  type!: 'video' | 'photo';

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  thumbnailTimestampMs?: number;
}

export class TikTokPostRequestDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsEnum(['INBOX', 'PUBLISH', 'DIRECT_POST', 'MEDIA_UPLOAD'])
  postMode?: 'INBOX' | 'PUBLISH' | 'DIRECT_POST' | 'MEDIA_UPLOAD';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TikTokMediaDto)
  media!: TikTokMediaDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TikTokPostingSettingsDto)
  settings?: TikTokPostingSettingsDto;
}

```

# src\integrations\tiktok\dto\schedule-tiktok.dto.ts

```ts
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { TikTokPostRequestDto } from './post-tiktok.dto';

export class ScheduleTikTokDto {
  @IsDateString()
  publishAt!: string;

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @ValidateNested()
  @Type(() => TikTokPostRequestDto)
  post!: TikTokPostRequestDto;
}


```

# src\integrations\tiktok\scheduled-post.repository.ts

```ts
import { Injectable, Logger } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../prisma/prisma.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';

export type PersistPayload = Prisma.InputJsonValue;

interface CompletionOptions {
  status: 'success' | 'inbox';
  publishId?: string;
  resultUrl?: string;
}

@Injectable()
export class ScheduledPostRepository {
  private readonly logger = new Logger(ScheduledPostRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createImmediatePost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    status: 'success' | 'inbox' | 'failed';
    publishId?: string;
    resultUrl?: string;
    idempotencyKey?: string;
  }) {
    const now = new Date();
    const normalizedOpenId = this.normalizeOpenId(options.openId);
    const status = this.mapStatus(options.status);
    const idempotencyKey = options.idempotencyKey ?? options.publishId ?? randomUUID();

    return this.prisma.scheduledPost.create({
      data: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status,
        runAt: now,
        jobId: null,
        publishId: options.publishId ?? null,
        resultUrl: options.resultUrl ?? null,
        idempotencyKey,
      },
    });
  }

  async createAsyncPost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    publishId: string;
  }) {
    const now = new Date();
    const normalizedOpenId = this.normalizeOpenId(options.openId);

    return this.prisma.scheduledPost.upsert({
      where: { idempotencyKey: options.publishId },
      create: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status: PostStatus.QUEUE,
        runAt: now,
        jobId: null,
        publishId: options.publishId,
        idempotencyKey: options.publishId,
      },
      update: {
        payload: options.payload,
        updatedAt: new Date(),
      },
    });
  }

  async createScheduledPost(options: {
    userId: string;
    openId: string;
    payload: PersistPayload;
    runAt: Date;
    jobId: string;
    idempotencyKey: string;
  }) {
    const normalizedOpenId = this.normalizeOpenId(options.openId);

    return this.prisma.scheduledPost.upsert({
      where: { idempotencyKey: options.idempotencyKey },
      create: {
        userId: options.userId,
        platform: 'tiktok',
        targetOpenId: normalizedOpenId,
        payload: options.payload,
        status: PostStatus.SCHEDULED,
        runAt: options.runAt,
        jobId: options.jobId,
        idempotencyKey: options.idempotencyKey,
      },
      update: {
        payload: options.payload,
        runAt: options.runAt,
        jobId: options.jobId,
        status: PostStatus.SCHEDULED,
        updatedAt: new Date(),
      },
    });
  }

  async markRunningByJobId(jobId: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: PostStatus.RUNNING,
        attempts: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }

  async markCompletedByJobId(jobId: string, options: CompletionOptions): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: this.mapStatus(options.status),
        publishId: options.publishId ?? null,
        resultUrl: options.resultUrl ?? null,
        updatedAt: new Date(),
      },
    });
  }

  async markFailedByJobId(jobId: string, error: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { jobId },
      data: {
        status: PostStatus.FAILED,
        lastError: error,
        updatedAt: new Date(),
      },
    });
  }

  async markCompletedByPublishId(publishId: string, options: CompletionOptions): Promise<void> {
    const updated = await this.prisma.scheduledPost.updateMany({
      where: { publishId },
      data: {
        status: this.mapStatus(options.status),
        resultUrl: options.resultUrl ?? null,
        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      this.logger.debug(`No scheduled post found for publishId=${publishId} to mark as completed`);
    }
  }

  async markFailedByPublishId(publishId: string, error: string): Promise<void> {
    await this.prisma.scheduledPost.updateMany({
      where: { publishId },
      data: {
        status: PostStatus.FAILED,
        lastError: error,
        updatedAt: new Date(),
      },
    });
  }

  async listPosts(userId: string, openId?: string) {
    return this.prisma.scheduledPost.findMany({
      where: {
        userId,
        ...(openId ? { targetOpenId: this.normalizeOpenId(openId) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private mapStatus(state: 'success' | 'inbox' | 'failed'): PostStatus {
    switch (state) {
      case 'success':
        return PostStatus.PUBLISHED;
      case 'inbox':
        return PostStatus.INBOX;
      case 'failed':
      default:
        return PostStatus.FAILED;
    }
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }
}

```

# src\integrations\tiktok\tiktok-account.repository.ts

```ts
import { Injectable } from '@nestjs/common';
import { TikTokAccount as TikTokAccountEntity } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { TikTokAccount } from './tiktok.types';

@Injectable()
export class TikTokAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAccounts(): Promise<TikTokAccount[]> {
    const records = await this.prisma.tikTokAccount.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async listAccountsForUser(userId: string): Promise<TikTokAccount[]> {
    const records = await this.prisma.tikTokAccount.findMany({
      where: { userId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async getAccount(userId: string, openId: string): Promise<TikTokAccount | undefined> {
    const normalizedOpenId = this.normalizeOpenId(openId);
    const record = await this.prisma.tikTokAccount.findUnique({
      where: {
        userId_openId: {
          userId,
          openId: normalizedOpenId,
        },
      },
    });

    return record ? this.toDomain(record) : undefined;
  }

  async upsertAccount(account: TikTokAccount): Promise<TikTokAccount> {
    const normalizedOpenId = this.normalizeOpenId(account.openId);
    await this.ensureUser(account.userId);

    const result = await this.prisma.tikTokAccount.upsert({
      where: {
        userId_openId: {
          userId: account.userId,
          openId: normalizedOpenId,
        },
      },
      update: this.toPersistence(account, normalizedOpenId),
      create: this.toPersistence(account, normalizedOpenId),
    });

    return this.toDomain(result);
  }

  private toDomain(record: TikTokAccountEntity): TikTokAccount {
    return {
      userId: record.userId,
      openId: record.openId,
      displayName: record.displayName ?? null,
      username: record.username ?? null,
      unionId: record.unionId ?? null,
      avatarUrl: record.avatarUrl ?? null,
      accessToken: record.accessToken,
      refreshToken: record.refreshToken ?? null,
      expiresAt: record.expiresAt.toISOString(),
      refreshExpiresAt: record.refreshExpiresAt?.toISOString() ?? null,
      scope: record.scope ?? [],
      timezoneOffsetMinutes: record.timezoneOffsetMinutes ?? null,
      connectedAt: record.connectedAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private toPersistence(account: TikTokAccount, normalizedOpenId: string) {
    return {
      userId: account.userId,
      openId: normalizedOpenId,
      displayName: account.displayName,
      username: account.username,
      unionId: account.unionId,
      avatarUrl: account.avatarUrl,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      expiresAt: new Date(account.expiresAt),
      refreshExpiresAt: account.refreshExpiresAt ? new Date(account.refreshExpiresAt) : null,
      scope: account.scope ?? [],
      timezoneOffsetMinutes: account.timezoneOffsetMinutes,
      connectedAt: new Date(account.connectedAt ?? new Date().toISOString()),
      updatedAt: new Date(),
    };
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }

  private async ensureUser(userId: string): Promise<void> {
    const trimmedUserId = userId?.trim();
    if (!trimmedUserId) {
      throw new Error('Unable to upsert TikTok account without a userId');
    }

    await this.prisma.user.upsert({
      where: { id: trimmedUserId },
      update: {},
      create: { id: trimmedUserId },
    });
  }
}

```

# src\integrations\tiktok\tiktok.controller.ts

```ts
import { Body, Controller, Get, Headers, Post, BadRequestException } from '@nestjs/common';

import { SessionService } from '../../common/session/session.service';
import { ConnectTikTokDto } from './dto/connect-tiktok.dto';
import { TikTokService } from './tiktok.service';

@Controller('integrations/social/tiktok')
export class TikTokController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly tikTokService: TikTokService,
  ) {}

  @Get()
  start(@Headers('x-user-id') userId: string) {
    const resolvedUserId = this.ensureUserId(userId);
    const pendingState = this.sessionService.registerState(resolvedUserId);
    return this.tikTokService.start(pendingState.state, pendingState.codeVerifier);
  }

  @Post('connect')
  async connect(@Headers('x-user-id') userId: string, @Body() dto: ConnectTikTokDto) {
    const resolvedUserId = this.ensureUserId(userId);
    const pendingState = this.sessionService.consumeState(resolvedUserId, dto.state);
    const account = await this.tikTokService.connect(
      resolvedUserId,
      dto,
      pendingState.codeVerifier,
    );
    const { accessToken, refreshToken, ...publicAccount } = account;

    return {
      success: true,
      account: publicAccount,
    };
  }

  @Get('accounts')
  async listAccounts(@Headers('x-user-id') userId: string) {
    const resolvedUserId = this.ensureUserId(userId);
    const accounts = await this.tikTokService.listAccounts(resolvedUserId);
    return accounts.map(({ accessToken, refreshToken, ...publicAccount }) => (
      {
        ...publicAccount,
      }
    ));
  }

  private ensureUserId(userId: string | undefined): string {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return userId.trim();
  }
}

```

# src\integrations\tiktok\tiktok.module.ts

```ts
import { Module } from '@nestjs/common';

import { SessionModule } from '../../common/session/session.module';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokController } from './tiktok.controller';
import { TikTokPostingController } from './tiktok.posting.controller';
import { TikTokPostingProvider } from './tiktok.posting.provider';
import { TikTokPostingService } from './tiktok.posting.service';
import { TikTokService } from './tiktok.service';
import { TikTokScheduler } from './tiktok.scheduler';
import { TikTokScheduleController } from './tiktok.schedule.controller';
import { ScheduledPostRepository } from './scheduled-post.repository';

@Module({
  imports: [SessionModule],
  controllers: [TikTokController, TikTokPostingController, TikTokScheduleController],
  providers: [
    TikTokService,
    TikTokPostingService,
    TikTokPostingProvider,
    TikTokAccountRepository,
    ScheduledPostRepository,
    TikTokScheduler,
  ],
})
export class TikTokModule {}

```

# src\integrations\tiktok\tiktok.posting.controller.ts

```ts
import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';

import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';

@Controller('integrations/social/tiktok')
export class TikTokPostingController {
  constructor(private readonly postingService: TikTokPostingService) {}

  @Post(':openId/post')
  async postToTikTok(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Body() body: TikTokPostRequestDto,
    @Query('async') asyncFlag?: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    if (typeof asyncFlag === 'string' && /^(1|true)$/i.test(asyncFlag.trim())) {
      const init = await this.postingService.postAsync(resolvedUserId, openId, body);
      return { accepted: true, publishId: init.publishId, status: 'processing' as const };
    }

    const result = await this.postingService.post(resolvedUserId, openId, body);
    return { success: true, postId: result.postId, releaseUrl: result.releaseUrl, status: result.status };
  }

  @Get(':openId/post/status/:publishId')
  async getPostStatus(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Param('publishId') publishId: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.fetchStatus(resolvedUserId, openId, publishId);
  }

  @Get(':openId/posts')
  async listPostsForAccount(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.listPosts(resolvedUserId, openId);
  }

  @Get('posts')
  async listPosts(@Headers('x-user-id') userId: string) {
    const resolvedUserId = this.ensureUserId(userId);
    return this.postingService.listPosts(resolvedUserId);
  }

  private ensureUserId(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return value.trim();
  }
}

```

# src\integrations\tiktok\tiktok.posting.provider.ts

```ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { BadBody, RefreshToken, SocialAbstract } from '../social/social.abstract';
import { TikTokAccount } from './tiktok.types';
import { TikTokPostRequestDto, TikTokPostingSettingsDto } from './dto/post-tiktok.dto';

type TikTokPostResult =
  | {
      postId: string;
      releaseUrl?: string;
      status: 'success';
    }
  | {
      postId: string;
      releaseUrl?: string;
      status: 'inbox';
    };

interface TikTokPostStatusSingle {
  status: 'processing' | 'success' | 'failed' | 'inbox';
  id?: string;
  url?: string;
}

interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  scope: string[];
  openId: string | null;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class TikTokPostingProvider extends SocialAbstract {
  protected readonly logger = new Logger(TikTokPostingProvider.name);
  private readonly clientKey = this.requireEnv('TIKTOK_CLIENT_KEY');
  private readonly clientSecret = this.requireEnv('TIKTOK_CLIENT_SECRET');
  private readonly scopes = [
    'user.info.basic',
    'user.info.profile',
    'video.upload',
    'video.publish',
  ];

  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    const form = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await this.fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });

    const payload = await response.json().catch(() => undefined);
    if (!response.ok) {
      const message =
        typeof payload?.message === 'string'
          ? payload.message
          : 'Unable to refresh TikTok token';
      throw new RefreshToken(message);
    }

    const data = this.extractDataObject(payload);
    const scope = this.parseScopes(data?.scope ?? payload?.scope ?? []);
    this.checkScopes(this.scopes, scope);

    const accessToken = data?.access_token ?? payload?.access_token;
    const nextRefreshToken = data?.refresh_token ?? payload?.refresh_token ?? refreshToken;

    if (!accessToken) {
      throw new RefreshToken('TikTok refresh did not return an access token');
    }

    const userInfo = await this.fetchUserInfo(accessToken);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      expiresIn: typeof (data?.expires_in ?? payload?.expires_in) === 'number'
        ? (data?.expires_in ?? payload?.expires_in)
        : null,
      refreshExpiresIn:
        typeof (data?.refresh_expires_in ?? payload?.refresh_expires_in) === 'number'
          ? (data?.refresh_expires_in ?? payload?.refresh_expires_in)
          : null,
      scope,
      openId: userInfo.openId,
      displayName: userInfo.displayName,
      username: userInfo.username,
      avatarUrl: userInfo.avatarUrl,
    };
  }

  async post(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<TikTokPostResult> {
    const { publishId } = await this.initPost(account, payload);

    const finalState = await this.uploadedVideoSuccess(
      account.username ?? account.openId,
      publishId,
      account.accessToken,
    );

    if (finalState.status === 'success') {
      return {
        postId: String(finalState.id),
        ...(finalState.url ? { releaseUrl: finalState.url } : {}),
        status: 'success',
      };
    }

    return {
      postId: String(finalState.id ?? publishId),
      status: 'inbox',
      releaseUrl: finalState.url,
    };
  }

  async initPostOnly(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<{ publishId: string }> {
    return this.initPost(account, payload);
  }

  private async initPost(account: TikTokAccount, payload: TikTokPostRequestDto): Promise<{ publishId: string }> {
    this.checkScopes(this.scopes, account.scope ?? []);

    const media = payload.media ?? [];
    if (media.length === 0) {
      throw new BadBody('tiktok-missing-media', 'No media provided for TikTok post');
    }

    const primaryMedia = media[0];
    const isPhoto = primaryMedia.type === 'photo';
    const settings: TikTokPostingSettingsDto = {
      contentPostingMethod: payload.settings?.contentPostingMethod ?? 'UPLOAD',
      privacyLevel: payload.settings?.privacyLevel ?? 'SELF_ONLY',
      duet: payload.settings?.duet ?? false,
      comment: payload.settings?.comment ?? false,
      stitch: payload.settings?.stitch ?? false,
      videoMadeWithAi: payload.settings?.videoMadeWithAi ?? false,
      brandContentToggle: payload.settings?.brandContentToggle ?? false,
      brandOrganicToggle: payload.settings?.brandOrganicToggle ?? false,
      autoAddMusic: payload.settings?.autoAddMusic ?? true,
      title: payload.settings?.title,
    };

    const endpointPath = this.postingMethod(settings.contentPostingMethod ?? 'DIRECT_POST', isPhoto);
    const endpoint = `https://open.tiktokapis.com/v2/post/publish${endpointPath}`;

    const body = this.buildPostBody(
      payload.caption ?? '',
      settings,
      media,
      isPhoto,
      payload.postMode,
    );

    const response = await this.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${account.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const payloadJson = await response.json().catch(() => undefined);
    if (!response.ok || !payloadJson?.data?.publish_id) {
      const serialized = JSON.stringify(payloadJson ?? {});
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      const fallbackMessage =
        handled?.value ??
        this.extractErrorMessage(payloadJson) ??
        'Failed to start TikTok publish flow';
      throw new BadBody(
        'tiktok-post-init-failed',
        serialized,
        Buffer.from(serialized),
        fallbackMessage,
      );
    }

    return { publishId: String(payloadJson.data.publish_id) };
  }

  async fetchPublishStatus(
    profileId: string,
    publishId: string,
    accessToken: string,
  ): Promise<TikTokPostStatusSingle> {
    const response = await this.fetch(
      'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ publish_id: publishId }),
      },
      'tiktok-post-status-once',
    );

    const payload = await response.json().catch(() => undefined);
    this.logger.debug(
      `TikTok fetchPublishStatus response (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
        payload ?? {},
      )}`,
    );
    if (!response.ok || !payload?.data) {
      this.logger.warn(
        `TikTok fetchPublishStatus returned unexpected payload (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
          payload ?? {},
        )}`,
      );
      const serialized = JSON.stringify(payload ?? {});
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      throw new BadBody(
        'tiktok-post-status-failed',
        serialized,
        Buffer.from(serialized),
        handled?.value ?? this.extractErrorMessage(payload) ?? 'Failed to retrieve TikTok publish status',
      );
    }

    const { status, publicly_available_post_id, publicaly_available_post_id } = payload.data;

    if (status === 'PUBLISH_COMPLETE') {
      const postId = publicly_available_post_id?.[0] ?? publicaly_available_post_id?.[0] ?? publishId;
      const url = publicly_available_post_id?.[0]
        ? `https://www.tiktok.com/@${profileId}/video/${publicly_available_post_id[0]}`
        : `https://www.tiktok.com/@${profileId}`;
      return { status: 'success', id: String(postId), url };
    }

    if (status === 'FAILED') {
      const serialized = JSON.stringify(payload);
      const handled = this.handleErrors(serialized);
      if (handled?.type === 'refresh-token') {
        throw new RefreshToken(handled.value);
      }
      return { status: 'failed' };
    }

    if (status === 'SEND_TO_USER_INBOX') {
      return { status: 'inbox', id: publishId };
    }

    return { status: 'processing' };
  }

  private buildPostBody(
    caption: string,
    settings: TikTokPostingSettingsDto,
    media: TikTokPostRequestDto['media'],
    isPhoto: boolean,
    postMode: TikTokPostRequestDto['postMode'],
  ): Record<string, unknown> {
    const primary = media[0];
    const body: Record<string, unknown> = {};
    const resolvedPostMode = this.resolvePostMode(settings, postMode, isPhoto);

    const titleSource = isPhoto ? settings.title ?? caption : caption;
    const postInfo: Record<string, unknown> = {
      privacy_level: settings.privacyLevel ?? 'SELF_ONLY',
      disable_duet: !(settings.duet ?? false),
      disable_comment: !(settings.comment ?? false),
      disable_stitch: !(settings.stitch ?? false),
      is_aigc: settings.videoMadeWithAi ?? false,
      brand_content_toggle: settings.brandContentToggle ?? false,
      brand_organic_toggle: settings.brandOrganicToggle ?? false,
    };

    if (titleSource && titleSource.length > 0) {
      postInfo.title = titleSource;
    }

    postInfo.description = caption ?? '';

    if (isPhoto && settings.autoAddMusic) {
      postInfo.auto_add_music = true;
    }

    body.post_info = postInfo;

    if (isPhoto) {
      body.source_info = {
        source: 'PULL_FROM_URL',
        photo_cover_index: 0,
        photo_images: media.map((item) => item.url),
      };
    } else {
      const videoInfo: Record<string, unknown> = {
        source: 'PULL_FROM_URL',
        video_url: primary.url,
      };
      if (typeof primary.thumbnailTimestampMs === 'number') {
        videoInfo.video_cover_timestamp_ms = primary.thumbnailTimestampMs;
      }

      body.source_info = videoInfo;
    }

    body.post_mode = resolvedPostMode;
    body.media_type = isPhoto ? 'PHOTO' : 'VIDEO';

    return body;
  }

  private postingMethod(method: TikTokPostingSettingsDto['contentPostingMethod'], isPhoto: boolean): string {
    switch (method) {
      case 'UPLOAD':
      case 'MEDIA_UPLOAD':
        return isPhoto ? '/content/init/' : '/inbox/video/init/';
      case 'URL':
      case 'DIRECT_POST':
      default:
        return isPhoto ? '/content/init/' : '/video/init/';
    }
  }

  private resolvePostMode(
    settings: TikTokPostingSettingsDto,
    requestedPostMode: TikTokPostRequestDto['postMode'],
    isPhoto: boolean,
  ): 'DIRECT_POST' | 'MEDIA_UPLOAD' {
    switch (requestedPostMode) {
      case 'DIRECT_POST':
      case 'MEDIA_UPLOAD':
        return requestedPostMode;
      case 'PUBLISH':
        return 'DIRECT_POST';
      case 'INBOX':
        return 'MEDIA_UPLOAD';
      default:
        break;
    }

    switch (settings.contentPostingMethod) {
      case 'DIRECT_POST':
        return 'DIRECT_POST';
      case 'URL':
        return 'DIRECT_POST';
      case 'UPLOAD':
      case 'MEDIA_UPLOAD':
        return 'MEDIA_UPLOAD';
      default:
        break;
    }

    return isPhoto ? 'MEDIA_UPLOAD' : 'DIRECT_POST';
  }

  private async uploadedVideoSuccess(
    profileId: string,
    publishId: string,
    accessToken: string,
  ): Promise<{ status: 'success'; id: string; url?: string } | { status: 'inbox'; id?: string; url?: string }> {
    const maxAttempts = Number(process.env.TIKTOK_POST_STATUS_ATTEMPTS ?? 30);
    const intervalMs = Number(process.env.TIKTOK_POST_STATUS_INTERVAL_MS ?? 10_000);
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts += 1;

      const response = await this.fetch(
        'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ publish_id: publishId }),
        },
        'tiktok-post-status',
      );

      const payload = await response.json().catch(() => undefined);
      this.logger.debug(
        `TikTok uploadedVideoSuccess attempt ${attempts}/${maxAttempts} (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
          payload ?? {},
        )}`,
      );
      if (!response.ok || !payload?.data) {
        this.logger.warn(
          `TikTok uploadedVideoSuccess received unexpected payload (publishId ${publishId}, http ${response.status}): ${JSON.stringify(
            payload ?? {},
          )}`,
        );
        const serialized = JSON.stringify(payload ?? {});
        const handled = this.handleErrors(serialized);
        if (handled?.type === 'refresh-token') {
          throw new RefreshToken(handled.value);
        }
        throw new BadBody(
          'tiktok-post-status-failed',
          serialized,
          Buffer.from(serialized),
          handled?.value ?? this.extractErrorMessage(payload) ?? 'Failed to retrieve TikTok publish status',
        );
      }

      const { status, publicly_available_post_id, publicaly_available_post_id } = payload.data;

      if (status === 'PUBLISH_COMPLETE') {
        const postId = publicly_available_post_id?.[0] ?? publicaly_available_post_id?.[0] ?? publishId;
        const url = publicly_available_post_id?.[0]
          ? `https://www.tiktok.com/@${profileId}/video/${publicly_available_post_id[0]}`
          : `https://www.tiktok.com/@${profileId}`;

        return {
          status: 'success',
          id: String(postId),
          url,
        };
      }

      if (status === 'FAILED') {
        const serialized = JSON.stringify(payload);
        const handled = this.handleErrors(serialized);
        if (handled?.type === 'refresh-token') {
          throw new RefreshToken(handled.value);
        }
        throw new BadBody(
          'tiktok-post-failed',
          serialized,
          Buffer.from(serialized),
          handled?.value ?? this.extractErrorMessage(payload) ?? 'TikTok marked the publish as failed',
        );
      }

      if (status === 'SEND_TO_USER_INBOX') {
        return {
          status: 'inbox',
          id: publishId,
        };
      }

      await this.sleep(intervalMs);
    }

    throw new BadBody(
      'tiktok-post-status-timeout',
      JSON.stringify({ publishId, attempts: maxAttempts }),
      undefined,
      'TikTok did not finish processing the post in time',
    );
  }

  private handleErrors(body: string):
    | { type: 'refresh-token' | 'bad-body'; value: string }
    | undefined {
    const normalized = body.toLowerCase();

    if (normalized.includes('access_token_invalid')) {
      return {
        type: 'refresh-token',
        value: 'Access token invalid, please re-authenticate your TikTok account',
      };
    }

    if (normalized.includes('scope_not_authorized')) {
      return {
        type: 'refresh-token',
        value: 'Missing required permissions, please re-authorize with TikTok',
      };
    }

    if (normalized.includes('scope_permission_missed')) {
      return {
        type: 'refresh-token',
        value: 'Additional TikTok permissions required, please re-authorize',
      };
    }

    if (normalized.includes('rate_limit_exceeded')) {
      return {
        type: 'bad-body',
        value: 'TikTok API rate limit exceeded, please try again later',
      };
    }

    if (normalized.includes('file_format_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Invalid file format, please check TikTok video specifications',
      };
    }

    if (normalized.includes('duration_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Video duration is invalid for TikTok',
      };
    }

    if (normalized.includes('frame_rate_check_failed')) {
      return {
        type: 'bad-body',
        value: 'Video frame rate is invalid for TikTok',
      };
    }

    if (normalized.includes('video_pull_failed')) {
      return {
        type: 'bad-body',
        value: 'TikTok could not download the video from the provided URL',
      };
    }

    if (normalized.includes('photo_pull_failed')) {
      return {
        type: 'bad-body',
        value: 'TikTok could not download the photo from the provided URL',
      };
    }

    if (normalized.includes('spam_risk')) {
      return {
        type: 'bad-body',
        value: 'TikTok flagged the content as potential spam',
      };
    }

    if (normalized.includes('reached_active_user_cap')) {
      return {
        type: 'bad-body',
        value: 'Daily active user quota reached for TikTok',
      };
    }

    if (normalized.includes('unaudited_client_can_only_post_to_private_accounts')) {
      return {
        type: 'bad-body',
        value: 'TikTok app is not approved for public posting. Contact support.',
      };
    }

    if (normalized.includes('invalid_file_upload') || normalized.includes('invalid_params')) {
      return {
        type: 'bad-body',
        value: 'TikTok rejected the request due to invalid media or parameters',
      };
    }

    if (normalized.includes('internal')) {
      return {
        type: 'bad-body',
        value: 'TikTok servers reported an internal error. Please try again later.',
      };
    }

    return undefined;
  }

  private async fetchUserInfo(accessToken: string) {
    const params = new URLSearchParams({
      fields: 'open_id,display_name,avatar_url,username,union_id',
    });

    const response = await this.fetch(
      `https://open.tiktokapis.com/v2/user/info/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      'tiktok-user-info',
    );

    const payload = await response.json().catch(() => undefined);
    if (!response.ok || !payload?.data?.user) {
      const message =
        typeof payload?.message === 'string'
          ? payload.message
          : 'Unable to fetch TikTok user profile';
      throw new RefreshToken(message);
    }

    const user = payload.data.user;
    const openId = typeof user?.open_id === 'string' ? this.normalizeOpenId(user.open_id) : null;

    return {
      openId,
      displayName: typeof user?.display_name === 'string' ? user.display_name : null,
      username: typeof user?.username === 'string' ? user.username : null,
      avatarUrl: typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    };
  }

  private normalizeOpenId(openId: string | null): string | null {
    if (!openId) {
      return null;
    }
    return openId.replace(/-/g, '').trim();
  }

  private parseScopes(scopeValue: unknown): string[] {
    if (Array.isArray(scopeValue)) {
      return scopeValue
        .map((entry) => (typeof entry === 'string' ? entry : String(entry)))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    if (typeof scopeValue === 'string') {
      return scopeValue
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    return [];
  }

  private extractDataObject(payload: any): any {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const data = (payload as any).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }

    return payload;
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

  private extractErrorMessage(payload: any): string | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (
      typeof payload.error === 'object' &&
      payload.error !== null &&
      typeof payload.error.message === 'string'
    ) {
      return payload.error.message;
    }

    if (
      Array.isArray(payload.errors) &&
      payload.errors.length > 0 &&
      typeof payload.errors[0]?.message === 'string'
    ) {
      return payload.errors[0].message;
    }

    if (
      typeof payload.data === 'object' &&
      payload.data !== null &&
      typeof (payload.data as any).error === 'object' &&
      (payload.data as any).error !== null &&
      typeof (payload.data as any).error.message === 'string'
    ) {
      return (payload.data as any).error.message;
    }

    if (typeof payload.description === 'string' && payload.description.trim().length > 0) {
      return payload.description;
    }

    return undefined;
  }
}

```

# src\integrations\tiktok\tiktok.posting.service.ts

```ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import {
  BadBody,
  NotEnoughScopes,
  RefreshToken,
} from '../social/social.abstract';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokAccount } from './tiktok.types';
import { TikTokPostingProvider } from './tiktok.posting.provider';
import { PersistPayload, ScheduledPostRepository } from './scheduled-post.repository';

interface TikTokPostOutcome {
  postId: string;
  releaseUrl?: string;
  status: 'success' | 'inbox';
}

@Injectable()
export class TikTokPostingService {
  private readonly logger = new Logger(TikTokPostingService.name);

  constructor(
    private readonly repository: TikTokAccountRepository,
    private readonly provider: TikTokPostingProvider,
    private readonly posts: ScheduledPostRepository,
  ) {}

  async post(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
    options?: { jobId?: string },
  ): Promise<TikTokPostOutcome> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const result = await this.provider.post(readyAccount, payload);
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
      });

      if (options?.jobId) {
        await this.posts.markCompletedByJobId(options.jobId, {
          status: result.status,
          publishId: result.postId,
          resultUrl: result.releaseUrl,
        });
      } else {
        await this.posts.createImmediatePost({
          userId,
          openId,
          payload: this.toPersistPayload(payload),
          status: result.status,
          publishId: result.postId,
          resultUrl: result.releaseUrl,
        });
      }

      return result;
    } catch (error) {
      const message = this.extractErrorMessage(error);
      if (options?.jobId) {
        await this.posts.markFailedByJobId(options.jobId, message);
      } else {
        await this.posts.createImmediatePost({
          userId,
          openId,
          payload: this.toPersistPayload(payload),
          status: 'failed',
          idempotencyKey: undefined,
        }).catch(() => undefined);
      }

      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotEnoughScopes) {
        throw new BadRequestException(
          `Missing TikTok permissions: ${error.missingScopes.join(', ')}`,
        );
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok post failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async postAsync(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
  ): Promise<{ publishId: string }> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const { publishId } = await this.provider.initPostOnly(readyAccount, payload);
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
      });

      await this.posts.createAsyncPost({
        userId,
        openId,
        payload: this.toPersistPayload(payload),
        publishId,
      });
      return { publishId };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotEnoughScopes) {
        throw new BadRequestException(
          `Missing TikTok permissions: ${error.missingScopes.join(', ')}`,
        );
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok post init failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async fetchStatus(
    userId: string,
    openId: string,
    publishId: string,
  ): Promise<{ status: 'processing' | 'failed' | 'success' | 'inbox'; postId?: string; releaseUrl?: string }> {
    const account = await this.repository.getAccount(userId, openId);
    if (!account) {
      throw new BadRequestException('TikTok account not found');
    }

    const readyAccount = await this.ensureFreshToken(account);

    try {
      const result = await this.provider.fetchPublishStatus(
        readyAccount.username ?? readyAccount.openId,
        publishId,
        readyAccount.accessToken,
      );

      if (result.status === 'success') {
        await this.posts.markCompletedByPublishId(publishId, {
          status: 'success',
          resultUrl: result.url,
        });
        return {
          status: 'success',
          postId: result.id,
          releaseUrl: result.url,
        };
      }
      if (result.status === 'inbox') {
        await this.posts.markCompletedByPublishId(publishId, {
          status: 'inbox',
        });
        return { status: 'inbox', postId: result.id };
      }
      if (result.status === 'processing') {
        return { status: 'processing' };
      }
      await this.posts.markFailedByPublishId(publishId, 'TikTok reported failure');
      return { status: 'failed' };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok status check failed (${error.code}): ${error.hint ?? error.message}`,
        );
        await this.posts.markFailedByPublishId(publishId, error.hint ?? error.message);
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  async listPosts(userId: string, openId?: string) {
    return this.posts.listPosts(userId, openId);
  }

  private async ensureFreshToken(account: TikTokAccount): Promise<TikTokAccount> {
    const expiresAt = Date.parse(account.expiresAt);
    const needsRefresh =
      Number.isNaN(expiresAt) || expiresAt - Date.now() < 60 * 1000;

    if (!needsRefresh) {
      return account;
    }

    if (!account.refreshToken) {
      throw new BadRequestException(
        'TikTok access token expired and no refresh token available',
      );
    }

    this.logger.debug(
      `Refreshing TikTok token for account ${account.openId} (user ${account.userId})`,
    );

    const refreshed = await this.provider.refreshToken(account.refreshToken);

    const updatedAccount: TikTokAccount = {
      ...account,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? account.refreshToken,
      expiresAt: this.calculateExpiry(refreshed.expiresIn ?? 3600),
      refreshExpiresAt: refreshed.refreshExpiresIn
        ? this.calculateExpiry(refreshed.refreshExpiresIn)
        : account.refreshExpiresAt,
      scope: refreshed.scope,
      displayName: refreshed.displayName ?? account.displayName,
      username: refreshed.username ?? account.username,
      avatarUrl: refreshed.avatarUrl ?? account.avatarUrl,
      openId: refreshed.openId ?? account.openId,
    };

    await this.repository.upsertAccount(updatedAccount);
    return updatedAccount;
  }

  private calculateExpiry(seconds: number): string {
    const base = Date.now();
    return new Date(base + seconds * 1000).toISOString();
  }

  private toPersistPayload(payload: TikTokPostRequestDto): PersistPayload {
    return {
      caption: payload.caption ?? '',
      media: payload.media ?? [],
      postMode: payload.postMode,
      settings: payload.settings,
    } as unknown as PersistPayload;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof BadBody) {
      return error.hint ?? error.message;
    }
    if (error instanceof RefreshToken) {
      return error.message;
    }
    if (error instanceof NotEnoughScopes) {
      return `Missing TikTok permissions: ${error.missingScopes.join(', ')}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}

```

# src\integrations\tiktok\tiktok.schedule.controller.ts

```ts
import { BadRequestException, Body, Controller, Headers, Param, Post, ServiceUnavailableException } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { ScheduleTikTokDto } from './dto/schedule-tiktok.dto';
import { PersistPayload, ScheduledPostRepository } from './scheduled-post.repository';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';

@Controller('integrations/social/tiktok')
export class TikTokScheduleController {
  constructor(
    private readonly queue: QueueService,
    private readonly posts: ScheduledPostRepository,
  ) {}

  @Post(':openId/schedule')
  async schedulePost(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
    @Body() body: ScheduleTikTokDto,
  ) {
    const trimmedUserId = userId?.trim();
    if (!trimmedUserId) {
      throw new BadRequestException('Missing x-user-id header');
    }

    const when = new Date(body.publishAt);
    if (Number.isNaN(when.getTime())) {
      throw new BadRequestException('Invalid publishAt');
    }

    if (!this.queue.isReady()) {
      throw new ServiceUnavailableException('Scheduling queue is not configured');
    }

    const normalizedOpenId = openId.trim();

    const job = await this.queue.addDelayed(
      'tiktok.post.at',
      {
        idempotencyKey: body.idempotencyKey,
        userId: trimmedUserId,
        openId: normalizedOpenId,
        body: body.post,
      },
      when,
    );

    const jobId = job.id ?? body.idempotencyKey;

    await this.posts.createScheduledPost({
      userId: trimmedUserId,
      openId: normalizedOpenId,
      payload: this.toPersistPayload(body.post),
      runAt: when,
      jobId,
      idempotencyKey: body.idempotencyKey,
    });

    return {
      scheduled: true,
      runAt: when.toISOString(),
      jobKey: jobId,
    };
  }

  private toPersistPayload(payload: TikTokPostRequestDto): PersistPayload {
    return {
      caption: payload.caption ?? '',
      media: payload.media ?? [],
      postMode: payload.postMode,
      settings: payload.settings,
    } as unknown as PersistPayload;
  }
}

```

# src\integrations\tiktok\tiktok.scheduler.ts

```ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';
import { ScheduledPostRepository } from './scheduled-post.repository';

interface ScheduleJobPayload {
  userId: string;
  openId: string;
  body: TikTokPostRequestDto;
}

@Injectable()
export class TikTokScheduler implements OnModuleInit {
  private readonly logger = new Logger(TikTokScheduler.name);

  constructor(
    private readonly queue: QueueService,
    private readonly postingService: TikTokPostingService,
    private readonly posts: ScheduledPostRepository,
  ) {}

  onModuleInit(): void {
    this.queue.attachWorker(async (payload, job) => {
      const { userId, openId, body } = payload as ScheduleJobPayload;
      const jobId = job.id ?? '';
      this.logger.log(`Executing scheduled TikTok post for user=${userId} openId=${openId} jobId=${jobId}`);

      if (jobId) {
        await this.posts.markRunningByJobId(jobId);
      }

      try {
        await this.postingService.post(userId, openId, body, { jobId });
      } catch (error) {
        throw error;
      }
    });
  }
}

```

# src\integrations\tiktok\tiktok.service.ts

```ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';

import { ConnectTikTokDto } from './dto/connect-tiktok.dto';
import { TikTokAccountRepository } from './tiktok-account.repository';
import { TikTokAccount } from './tiktok.types';

interface OAuthTokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  scope: string[];
  openId: string | null;
}

interface TikTokUserInfo {
  openId: string | null;
  displayName: string | null;
  username: string | null;
  unionId: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class TikTokService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly clientKey = this.requireEnv('TIKTOK_CLIENT_KEY');
  private readonly clientSecret = this.requireEnv('TIKTOK_CLIENT_SECRET');
  private readonly redirectUri = this.requireEnv('TIKTOK_REDIRECT_URI');
  private readonly requiredScopes = [
    'user.info.basic',
    'user.info.profile',
    'video.list',
    'video.upload',
    'video.publish',
  ];
  private readonly scopes = this.getScopes();
  private readonly forceVerify =
    (process.env.TIKTOK_FORCE_VERIFY ?? 'false').toLowerCase() === 'true';
  private readonly mockMode =
    (process.env.TIKTOK_MOCK ?? 'false').toLowerCase() === 'true';

  constructor(
    private readonly repository: TikTokAccountRepository,
  ) {}

  start(state: string, codeVerifier: string): { url: string } {
    const url = this.buildAuthorizeUrl(state, codeVerifier);
    return { url };
  }

  async connect(
    userId: string,
    dto: ConnectTikTokDto,
    codeVerifier: string,
  ): Promise<TikTokAccount> {
    if (this.mockMode) {
      const account = this.buildMockAccount(dto, userId);
      await this.repository.upsertAccount(account);
      return account;
    }

    const token = await this.exchangeCodeForToken(dto.code, codeVerifier);
    this.logger.debug?.(
      `TikTok token scopes granted: ${token.scope.join(', ') || '(none)'}`,
    );
    this.ensureRequiredScopes(token.scope);

    const userInfo = await this.fetchUserInfo(token.accessToken);

    const now = new Date();
    const timezoneOffsetMinutes = this.parseTimezone(dto.timezone);

    const rawOpenId = userInfo.openId ?? token.openId ?? this.ensureOpenId(token);
    const normalizedOpenId = this.normalizeOpenId(rawOpenId);

    const account: TikTokAccount = {
      userId,
      openId: normalizedOpenId,
      displayName: userInfo.displayName,
      username: userInfo.username ?? userInfo.displayName ?? normalizedOpenId,
      unionId: userInfo.unionId,
      avatarUrl: userInfo.avatarUrl,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: this.calculateExpiry(now, token.expiresIn),
      refreshExpiresAt: this.calculateExpiry(now, token.refreshExpiresIn),
      scope: token.scope,
      timezoneOffsetMinutes,
      connectedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await this.repository.upsertAccount(account);
    return account;
  }

  async listAccounts(userId: string): Promise<TikTokAccount[]> {
    return this.repository.listAccountsForUser(userId);
  }

  private async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<OAuthTokenResponse> {
    const form = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });

    if (codeVerifier && codeVerifier.length > 0) {
      form.set('code_verifier', codeVerifier);
    }

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    }).catch((error: unknown) => {
      this.logger.error(`Failed to reach TikTok token endpoint`, error as Error);
      throw new BadRequestException('Unable to reach TikTok token endpoint');
    });

    const payload = await this.safeJson(response);
    const data = this.extractDataObject(payload);

    if (!response.ok) {
      const message =
        (typeof data === 'object' && (data as any)?.message) ||
        (typeof (data as any)?.error_msg === 'string' && (data as any).error_msg) ||
        'TikTok token exchange failed';
      throw new BadRequestException(message);
    }

    const scope = this.parseScopes(
      (data as any)?.scope ?? (payload as any)?.scope ?? [],
    );

    return {
      accessToken: (data as any)?.access_token,
      refreshToken: (data as any)?.refresh_token ?? null,
      expiresIn:
        typeof (data as any)?.expires_in === 'number' ? (data as any).expires_in : null,
      refreshExpiresIn:
        typeof (data as any)?.refresh_expires_in === 'number'
          ? (data as any).refresh_expires_in
          : null,
      scope,
      openId: typeof (data as any)?.open_id === 'string' ? (data as any).open_id : null,
    };
  }

  private async fetchUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    const params = new URLSearchParams({
      fields: 'open_id,display_name,avatar_url,username,union_id',
    });

    const response = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).catch((error: unknown) => {
      this.logger.error(`Failed to reach TikTok user info endpoint`, error as Error);
      throw new BadRequestException('Unable to fetch TikTok profile information');
    });

    const payload = await this.safeJson(response);
    const data: any = this.extractDataObject(payload) ?? {};
    const user: any = data?.user ?? {};

    if (!response.ok) {
      const message = this.extractErrorMessage(payload) ?? 'TikTok user info retrieval failed';
      this.logger.warn(
        `TikTok user info request failed (status ${response.status}): ${message}`,
      );
      this.logger.debug?.(
        `TikTok user info error payload: ${JSON.stringify(payload)}`,
      );
      throw new BadRequestException(message);
    }

    return {
      openId: typeof user?.open_id === 'string' ? user.open_id : null,
      displayName:
        typeof user?.display_name === 'string' ? user.display_name : null,
      username: typeof user?.username === 'string' ? user.username : null,
      unionId: typeof user?.union_id === 'string' ? user.union_id : null,
      avatarUrl:
        typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    };
  }

  private buildAuthorizeUrl(state: string, codeVerifier: string): string {
    const codeChallenge = this.buildCodeChallenge(codeVerifier);
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: this.scopes,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    if (this.forceVerify) {
      params.set('force_verify', '1');
    }

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  private getScopes(): string {
    const fromEnv = process.env.TIKTOK_SCOPES;
    const envScopes = fromEnv
      ? fromEnv
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const combined = new Set<string>([...this.requiredScopes, ...envScopes]);
    return Array.from(combined).join(',');
  }

  private parseTimezone(value?: string): number | null {
    if (!value) {
      return null;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return parsed;
  }

  private calculateExpiry(now: Date, seconds: number | null): string {
    const base = now.getTime();
    const duration = seconds && seconds > 0 ? seconds * 1000 : 3600 * 1000;
    return new Date(base + duration).toISOString();
  }

  private ensureRequiredScopes(granted: string[]): void {
    const grantedSet = new Set(granted.map((scope) => scope.trim()));
    const missing = this.requiredScopes.filter(
      (scope) => !grantedSet.has(scope),
    );

    if (missing.length > 0) {
      throw new BadRequestException(
        `TikTok did not grant the required permissions (${missing.join(
          ', ',
        )}). Please re-authorize and make sure all requested scopes are approved.`,
      );
    }
  }

  private ensureOpenId(token: OAuthTokenResponse): string {
    if (typeof token.openId === 'string' && token.openId.trim().length > 0) {
      return token.openId.trim();
    }

    throw new BadRequestException(
      'TikTok did not return the open_id for this account. Please ensure the app is approved for the user.info.profile scope and try connecting again.',
    );
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }

  private buildCodeChallenge(verifier: string): string {
    const hash = createHash('sha256').update(verifier).digest('base64');
    return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private parseScopes(scopeValue: unknown): string[] {
    if (Array.isArray(scopeValue)) {
      return scopeValue
        .map((entry) => (typeof entry === 'string' ? entry : String(entry)))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    if (typeof scopeValue === 'string') {
      return scopeValue
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    return [];
  }

  private extractDataObject(payload: any): any {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      const data = (payload as any).data;
      if (data && typeof data === 'object') {
        return data;
      }
    }

    return payload;
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

  private async safeJson(response: globalThis.Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  private extractErrorMessage(payload: any): string | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (
      typeof payload.error === 'object' &&
      payload.error !== null &&
      typeof payload.error.message === 'string'
    ) {
      return payload.error.message;
    }

    if (
      typeof payload.data === 'object' &&
      payload.data !== null &&
      typeof (payload.data as any).error === 'object' &&
      (payload.data as any).error !== null &&
      typeof (payload.data as any).error.message === 'string'
    ) {
      return (payload.data as any).error.message;
    }

    return undefined;
  }

  private buildMockAccount(dto: ConnectTikTokDto, userId: string): TikTokAccount {
    const now = new Date();
    const accessToken = `mock_access_${randomBytes(8).toString('hex')}`;
    const refreshToken = `mock_refresh_${randomBytes(8).toString('hex')}`;
    const openId = `mock_${randomBytes(6).toString('hex')}`;
    const normalizedOpenId = this.normalizeOpenId(openId);

    return {
      userId,
      openId: normalizedOpenId,
      displayName: 'Mock TikTok Account',
      username: `mock_${normalizedOpenId.slice(-4)}`,
      unionId: null,
      avatarUrl: null,
      accessToken,
      refreshToken,
      expiresAt: this.calculateExpiry(now, 7200),
      refreshExpiresAt: this.calculateExpiry(now, 3600 * 24 * 30),
      scope: [...this.requiredScopes],
      timezoneOffsetMinutes: this.parseTimezone(dto.timezone),
      connectedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }
}

```

# src\integrations\tiktok\tiktok.types.ts

```ts
export interface TikTokAccount {
  userId: string;
  openId: string;
  displayName: string | null;
  username: string | null;
  unionId: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string;
  refreshExpiresAt: string | null;
  scope: string[];
  timezoneOffsetMinutes: number | null;
  connectedAt: string;
  updatedAt: string;
}

```

# src\main.ts

```ts
import { config as loadEnv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();

```

# src\prisma\prisma.module.ts

```ts
import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}


```

# src\prisma\prisma.service.ts

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}


```

# src\queue\queue.module.ts

```ts
import { Global, Module } from '@nestjs/common';

import { QueueService } from './queue.service';

@Global()
@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}


```

# src\queue\queue.service.ts

```ts
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, JobsOptions, Queue, Worker } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

interface ScheduleJobPayload {
  idempotencyKey: string;
  userId: string;
  openId: string;
  body: unknown;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection?: IORedis;
  private workerConnection?: IORedis;
  private queue?: Queue<ScheduleJobPayload>;
  private worker?: Worker<ScheduleJobPayload>;

  async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn('REDIS_URL is not set; scheduling features are disabled');
      return;
    }

    this.connection = this.createConnection(redisUrl);
    this.queue = new Queue<ScheduleJobPayload>(process.env.POST_SCHEDULE_QUEUE ?? 'tiktok-posts', {
      connection: this.connection,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
    await this.workerConnection?.quit();
    await this.connection?.quit();
  }

  async addDelayed(
    name: string,
    payload: ScheduleJobPayload,
    runAt: Date,
    opts: Partial<JobsOptions> = {},
  ) {
    if (!this.queue) {
      throw new Error('Queue not initialised');
    }

    const group = this.sanitizeForJobId(process.env.POST_SCHEDULE_GROUP ?? 'slidescockpit');
    const baseKey = this.sanitizeForJobId(String(payload.idempotencyKey ?? Date.now()));
    const jobId = `${group}-${baseKey}`;
    return this.queue.add(name, payload, {
      jobId,
      delay: Math.max(0, runAt.getTime() - Date.now()),
      removeOnComplete: 500,
      removeOnFail: 1000,
      ...opts,
    });
  }

  attachWorker(
    processor: (payload: ScheduleJobPayload, job: Job<ScheduleJobPayload>) => Promise<void>,
  ): void {
    if (!this.queue || !this.connection) {
      this.logger.warn('Queue not initialised; worker not attached');
      return;
    }
    if (this.worker) {
      return;
    }

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn('REDIS_URL is not set; worker cannot attach');
      return;
    }

    this.workerConnection = this.createConnection(redisUrl);
    this.worker = new Worker<ScheduleJobPayload>(this.queue.name, async (job) => processor(job.data, job), {
      connection: this.workerConnection,
      concurrency: 1,
    });
  }

  isReady(): boolean {
    return Boolean(this.queue);
  }

  private createConnection(redisUrl: string): IORedis {
    const baseOptions: RedisOptions = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 10_000,
      keepAlive: 10_000,
    };
    return new IORedis(redisUrl, baseOptions);
  }

  private sanitizeForJobId(value: string): string {
    const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, '-');
    return sanitized.length > 0 ? sanitized : `job-${Date.now()}`;
  }
}

```

# src\slideshow-library\dto\create-slideshow-account.dto.ts

```ts
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSlideshowAccountDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  followerCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  followingCount?: number;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

```

# src\slideshow-library\slideshow-accounts.service.ts

```ts
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

```

# src\slideshow-library\slideshow-library.controller.ts

```ts
// src/slideshow-library/slideshow-library.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SlideshowAccountsService } from './slideshow-accounts.service';
import { SlideshowPostsService } from './slideshow-posts.service';
import { Express } from 'express';
import { CreateSlideshowAccountDto } from './dto/create-slideshow-account.dto';

@Controller('slideshow-library')
export class SlideshowLibraryController {
  constructor(
    private accountsService: SlideshowAccountsService,
    private postsService: SlideshowPostsService,
  ) {}

  // Accounts
  @Get('accounts')
  async getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get('accounts/:id')
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Post('accounts')
  async createAccount(@Body() data: CreateSlideshowAccountDto) {
    return this.accountsService.createAccount(data);
  }

  @Post('accounts/upload-profile')
  @UseInterceptors(FilesInterceptor('profileImage', 1))
  async uploadProfileImage(@UploadedFiles() files: Express.Multer.File[]) {
    const file = files?.[0];
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    const url = await this.accountsService.uploadProfileImage(file);
    return { success: true, url };
  }

  @Put('accounts/:id')
  async updateAccount(@Param('id') id: string, @Body() data: any) {
    return this.accountsService.updateAccount(id, data);
  }

  @Post('accounts/:id/sync')
  async syncAccount(@Param('id') id: string) {
    return this.accountsService.syncAccountData(id);
  }

  // Posts
  @Get('posts')
  async getAllPosts(@Query('limit') limit?: number) {
    return this.postsService.getAllPosts(limit);
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Get('accounts/:accountId/posts')
  async getPostsByAccount(
    @Param('accountId') accountId: string,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.getPostsByAccount(accountId, limit);
  }

  @Post('posts')
  async createPost(@Body() data: any) {
    return this.postsService.createPost(data);
  }

  @Post('posts/upload-slides')
  @UseInterceptors(FilesInterceptor('slides', 50))
  async uploadSlides(@UploadedFiles() files: Express.Multer.File[]) {
    return this.postsService.uploadSlides(files);
  }

  @Put('posts/:postId/stats')
  async updatePostStats(@Param('postId') postId: string, @Body() stats: any) {
    return this.postsService.updatePostStats(postId, stats);
  }

  @Put('posts/:postId/reorder')
  async reorderPostSlides(
    @Param('postId') postId: string,
    @Body() body: { slideIds: string[] },
  ) {
    return this.postsService.updateSlideOrder(postId, body.slideIds);
  }

  @Put('posts/:id/prompt')
  async updatePostPrompt(
    @Param('id') id: string,
    @Body() body: { prompt?: string | null },
  ) {
    return this.postsService.updatePostPrompt(id, body.prompt ?? null);
  }
}

```

# src\slideshow-library\slideshow-library.module.ts

```ts
// src/slideshow-library/slideshow-library.module.ts
import { Module } from '@nestjs/common';
import { SlideshowLibraryController } from './slideshow-library.controller';
import { SlideshowAccountsService } from './slideshow-accounts.service';
import { SlideshowPostsService } from './slideshow-posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [SlideshowLibraryController],
  providers: [SlideshowAccountsService, SlideshowPostsService],
  exports: [SlideshowAccountsService, SlideshowPostsService],
})
export class SlideshowLibraryModule {}

```

# src\slideshow-library\slideshow-posts.service.ts

```ts
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
    return this.prisma.slideshowPost.create({
      data: {
        ...data,
        slideCount: data.slides.length,
        prompt:
          data.prompt && data.prompt.trim().length > 0
            ? data.prompt.trim()
            : null,
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

  async updatePostPrompt(postId: string, prompt?: string | null) {
    const normalizedPrompt =
      prompt && prompt.trim().length > 0 ? prompt.trim() : null;

    return this.prisma.slideshowPost.update({
      where: { id: postId },
      data: { prompt: normalizedPrompt },
      include: {
        slides: {
          orderBy: { slideIndex: 'asc' },
        },
        account: true,
      },
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

```

# storage\tiktok-accounts.json

```json
[]
```

# test\app.e2e-spec.ts

```ts
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

```

# test\jest-e2e.json

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": "\\.e2e-spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}

```

# tsconfig.build.json

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}

```

