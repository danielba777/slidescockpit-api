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
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
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
    "@nestjs/platform-express": "^11.0.1",
    "bullmq": "^5.61.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "dotenv": "^17.2.3",
    "ioredis": "^5.8.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
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
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["@nestjs/core", "@swc/core"]
  }
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

# src/app.controller.spec.ts

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

# src/app.controller.ts

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

# src/app.module.ts

```ts
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TikTokModule } from './integrations/tiktok/tiktok.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [AuthModule, TikTokModule, FilesModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

# src/app.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

# src/auth/auth.controller.ts

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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

# src/auth/auth.module.ts

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

# src/auth/auth.service.ts

```ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';

import {
  SessionData,
  SessionService,
  SessionUser,
} from '../common/session/session.service';
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
      throw new InternalServerErrorException(
        'POSTIZ_PASSWORD is not configured',
      );
    }
    if (!configuredProvider) {
      throw new InternalServerErrorException(
        'POSTIZ_PROVIDER is not configured',
      );
    }

    const matchesEmail =
      dto.email.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
    const matchesPassword = dto.password === configuredPassword;
    const matchesProvider =
      dto.provider.trim().toLowerCase() ===
      configuredProvider.trim().toLowerCase();

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

# src/auth/dto/login.dto.ts

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

# src/common/session/session.module.ts

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

# src/common/session/session.service.ts

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

# src/files/dto/presign-request.dto.ts

```ts
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

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

# src/files/files.controller.ts

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

# src/files/files.module.ts

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

# src/files/files.service.ts

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

  async createUploadUrl(params: PresignParams) {
    const {
      key,
      contentType = 'application/octet-stream',
      expiresInSec = 900,
    } = params;
    const normalizedKey = this.normalizeKey(key);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: normalizedKey,
      ContentType: contentType,
      ACL: 'private',
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSec,
    });
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
      throw new InternalServerErrorException(
        `${name} environment variable is not configured`,
      );
    }
    return value;
  }
}
```

# src/integrations/social/social.abstract.ts

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

# src/integrations/tiktok/dto/connect-tiktok.dto.ts

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

# src/integrations/tiktok/dto/post-tiktok.dto.ts

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

# src/integrations/tiktok/dto/schedule-tiktok.dto.ts

```ts
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

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

# src/integrations/tiktok/tiktok-account.repository.ts

```ts
import { Injectable, Logger } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { TikTokAccount } from './tiktok.types';

@Injectable()
export class TikTokAccountRepository {
  private readonly logger = new Logger(TikTokAccountRepository.name);
  private readonly storagePath = join(
    process.cwd(),
    'storage',
    'tiktok-accounts.json',
  );
  private readonly ready: Promise<void>;
  private cache: TikTokAccount[] = [];

  constructor() {
    this.ready = this.loadFromDisk();
  }

  async listAccounts(): Promise<TikTokAccount[]> {
    await this.ready;
    return this.cache.map((account) => ({ ...account }));
  }

  async listAccountsForUser(userId: string): Promise<TikTokAccount[]> {
    await this.ready;
    return this.cache
      .filter((account) => account.userId === userId)
      .map((account) => ({ ...account }));
  }

  async getAccount(
    userId: string,
    openId: string,
  ): Promise<TikTokAccount | undefined> {
    await this.ready;
    const normalized = this.normalizeOpenId(openId);
    const found = this.cache.find(
      (account) =>
        account.userId === userId &&
        this.normalizeOpenId(account.openId) === normalized,
    );
    return found ? { ...found } : undefined;
  }

  async upsertAccount(account: TikTokAccount): Promise<TikTokAccount> {
    await this.ready;
    const normalizedOpenId = this.normalizeOpenId(account.openId);
    const record: TikTokAccount = {
      ...account,
      openId: normalizedOpenId,
      connectedAt: account.connectedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const index = this.cache.findIndex(
      (item) =>
        item.userId === record.userId &&
        this.normalizeOpenId(item.openId) === normalizedOpenId,
    );
    if (index >= 0) {
      this.cache[index] = record;
    } else {
      this.cache.push(record);
    }

    await this.persist();
    return record;
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const content = await readFile(this.storagePath, 'utf8');
      const parsed: unknown = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        this.cache = [];
        return;
      }

      this.cache = parsed
        .map(this.normalizeAccount.bind(this))
        .filter((account): account is TikTokAccount => account !== undefined);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.ensureDirectory();
        this.cache = [];
        await this.persist();
        return;
      }
      this.logger.warn(
        `Failed to load TikTok accounts store (${String(error)}) – continuing with empty store`,
      );
      this.cache = [];
    }
  }

  private async persist(): Promise<void> {
    await this.ensureDirectory();
    const payload = JSON.stringify(this.cache, null, 2);
    await writeFile(this.storagePath, payload, 'utf8');
  }

  private async ensureDirectory(): Promise<void> {
    await mkdir(dirname(this.storagePath), { recursive: true });
  }

  private normalizeAccount(candidate: any): TikTokAccount | undefined {
    if (!candidate || typeof candidate !== 'object') {
      return undefined;
    }

    if (typeof candidate.userId !== 'string' || candidate.userId.length === 0) {
      this.logger.warn(
        'Skipping TikTok account entry without userId. Consider re-connecting the account.',
      );
      return undefined;
    }

    if (typeof candidate.openId !== 'string' || candidate.openId.length === 0) {
      return undefined;
    }

    const normalizedOpenId = this.normalizeOpenId(candidate.openId);

    return {
      userId: candidate.userId,
      openId: normalizedOpenId,
      displayName:
        typeof candidate.displayName === 'string'
          ? candidate.displayName
          : null,
      username:
        typeof candidate.username === 'string' ? candidate.username : null,
      unionId: typeof candidate.unionId === 'string' ? candidate.unionId : null,
      avatarUrl:
        typeof candidate.avatarUrl === 'string' ? candidate.avatarUrl : null,
      accessToken:
        typeof candidate.accessToken === 'string' ? candidate.accessToken : '',
      refreshToken:
        typeof candidate.refreshToken === 'string'
          ? candidate.refreshToken
          : null,
      expiresAt:
        typeof candidate.expiresAt === 'string'
          ? candidate.expiresAt
          : new Date().toISOString(),
      refreshExpiresAt:
        typeof candidate.refreshExpiresAt === 'string'
          ? candidate.refreshExpiresAt
          : null,
      scope: this.parseScope(candidate.scope),
      timezoneOffsetMinutes:
        typeof candidate.timezoneOffsetMinutes === 'number'
          ? candidate.timezoneOffsetMinutes
          : null,
      connectedAt:
        typeof candidate.connectedAt === 'string'
          ? candidate.connectedAt
          : new Date().toISOString(),
      updatedAt:
        typeof candidate.updatedAt === 'string'
          ? candidate.updatedAt
          : new Date().toISOString(),
    };
  }

  private normalizeOpenId(openId: string): string {
    return openId.replace(/-/g, '').trim();
  }

  private parseScope(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .map((entry) => (typeof entry === 'string' ? entry : String(entry)))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    if (typeof value === 'string') {
      return value
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }

    return [];
  }
}
```

# src/integrations/tiktok/tiktok.controller.ts

```ts
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  BadRequestException,
} from '@nestjs/common';

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
    return this.tikTokService.start(
      pendingState.state,
      pendingState.codeVerifier,
    );
  }

  @Post('connect')
  async connect(
    @Headers('x-user-id') userId: string,
    @Body() dto: ConnectTikTokDto,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    const pendingState = this.sessionService.consumeState(
      resolvedUserId,
      dto.state,
    );
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
    return accounts.map(({ accessToken, refreshToken, ...publicAccount }) => ({
      ...publicAccount,
    }));
  }

  private ensureUserId(userId: string | undefined): string {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return userId.trim();
  }
}
```

# src/integrations/tiktok/tiktok.module.ts

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

@Module({
  imports: [SessionModule],
  controllers: [
    TikTokController,
    TikTokPostingController,
    TikTokScheduleController,
  ],
  providers: [
    TikTokService,
    TikTokPostingService,
    TikTokPostingProvider,
    TikTokAccountRepository,
    TikTokScheduler,
  ],
})
export class TikTokModule {}
```

# src/integrations/tiktok/tiktok.posting.controller.ts

```ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';

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
      const init = await this.postingService.postAsync(
        resolvedUserId,
        openId,
        body,
      );
      return {
        accepted: true,
        publishId: init.publishId,
        status: 'processing' as const,
      };
    }

    const result = await this.postingService.post(resolvedUserId, openId, body);
    return {
      success: true,
      postId: result.postId,
      releaseUrl: result.releaseUrl,
      status: result.status,
    };
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

  private ensureUserId(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return value.trim();
  }
}
```

# src/integrations/tiktok/tiktok.posting.provider.ts

```ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import {
  BadBody,
  RefreshToken,
  SocialAbstract,
} from '../social/social.abstract';
import { TikTokAccount } from './tiktok.types';
import {
  TikTokPostRequestDto,
  TikTokPostingSettingsDto,
} from './dto/post-tiktok.dto';

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

    const response = await this.fetch(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      },
    );

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
    const nextRefreshToken =
      data?.refresh_token ?? payload?.refresh_token ?? refreshToken;

    if (!accessToken) {
      throw new RefreshToken('TikTok refresh did not return an access token');
    }

    const userInfo = await this.fetchUserInfo(accessToken);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      expiresIn:
        typeof (data?.expires_in ?? payload?.expires_in) === 'number'
          ? (data?.expires_in ?? payload?.expires_in)
          : null,
      refreshExpiresIn:
        typeof (data?.refresh_expires_in ?? payload?.refresh_expires_in) ===
        'number'
          ? (data?.refresh_expires_in ?? payload?.refresh_expires_in)
          : null,
      scope,
      openId: userInfo.openId,
      displayName: userInfo.displayName,
      username: userInfo.username,
      avatarUrl: userInfo.avatarUrl,
    };
  }

  async post(
    account: TikTokAccount,
    payload: TikTokPostRequestDto,
  ): Promise<TikTokPostResult> {
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

  async initPostOnly(
    account: TikTokAccount,
    payload: TikTokPostRequestDto,
  ): Promise<{ publishId: string }> {
    return this.initPost(account, payload);
  }

  private async initPost(
    account: TikTokAccount,
    payload: TikTokPostRequestDto,
  ): Promise<{ publishId: string }> {
    this.checkScopes(this.scopes, account.scope ?? []);

    const media = payload.media ?? [];
    if (media.length === 0) {
      throw new BadBody(
        'tiktok-missing-media',
        'No media provided for TikTok post',
      );
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

    const endpointPath = this.postingMethod(
      settings.contentPostingMethod ?? 'DIRECT_POST',
      isPhoto,
    );
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
        handled?.value ??
          this.extractErrorMessage(payload) ??
          'Failed to retrieve TikTok publish status',
      );
    }

    const { status, publicly_available_post_id, publicaly_available_post_id } =
      payload.data;

    if (status === 'PUBLISH_COMPLETE') {
      const postId =
        publicly_available_post_id?.[0] ??
        publicaly_available_post_id?.[0] ??
        publishId;
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

    const titleSource = isPhoto ? (settings.title ?? caption) : caption;
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

  private postingMethod(
    method: TikTokPostingSettingsDto['contentPostingMethod'],
    isPhoto: boolean,
  ): string {
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
  ): Promise<
    | { status: 'success'; id: string; url?: string }
    | { status: 'inbox'; id?: string; url?: string }
  > {
    const maxAttempts = Number(process.env.TIKTOK_POST_STATUS_ATTEMPTS ?? 30);
    const intervalMs = Number(
      process.env.TIKTOK_POST_STATUS_INTERVAL_MS ?? 10_000,
    );
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
          handled?.value ??
            this.extractErrorMessage(payload) ??
            'Failed to retrieve TikTok publish status',
        );
      }

      const {
        status,
        publicly_available_post_id,
        publicaly_available_post_id,
      } = payload.data;

      if (status === 'PUBLISH_COMPLETE') {
        const postId =
          publicly_available_post_id?.[0] ??
          publicaly_available_post_id?.[0] ??
          publishId;
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
          handled?.value ??
            this.extractErrorMessage(payload) ??
            'TikTok marked the publish as failed',
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

  private handleErrors(
    body: string,
  ): { type: 'refresh-token' | 'bad-body'; value: string } | undefined {
    const normalized = body.toLowerCase();

    if (normalized.includes('access_token_invalid')) {
      return {
        type: 'refresh-token',
        value:
          'Access token invalid, please re-authenticate your TikTok account',
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

    if (
      normalized.includes('unaudited_client_can_only_post_to_private_accounts')
    ) {
      return {
        type: 'bad-body',
        value:
          'TikTok app is not approved for public posting. Contact support.',
      };
    }

    if (
      normalized.includes('invalid_file_upload') ||
      normalized.includes('invalid_params')
    ) {
      return {
        type: 'bad-body',
        value: 'TikTok rejected the request due to invalid media or parameters',
      };
    }

    if (normalized.includes('internal')) {
      return {
        type: 'bad-body',
        value:
          'TikTok servers reported an internal error. Please try again later.',
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
    const openId =
      typeof user?.open_id === 'string'
        ? this.normalizeOpenId(user.open_id)
        : null;

    return {
      openId,
      displayName:
        typeof user?.display_name === 'string' ? user.display_name : null,
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

    if (
      typeof payload.message === 'string' &&
      payload.message.trim().length > 0
    ) {
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

    if (
      typeof payload.description === 'string' &&
      payload.description.trim().length > 0
    ) {
      return payload.description;
    }

    return undefined;
  }
}
```

# src/integrations/tiktok/tiktok.posting.service.ts

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
  ) {}

  async post(
    userId: string,
    openId: string,
    payload: TikTokPostRequestDto,
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
      return result;
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
      const { publishId } = await this.provider.initPostOnly(
        readyAccount,
        payload,
      );
      await this.repository.upsertAccount({
        ...readyAccount,
        updatedAt: new Date().toISOString(),
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
  ): Promise<{
    status: 'processing' | 'failed' | 'success' | 'inbox';
    postId?: string;
    releaseUrl?: string;
  }> {
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
        return {
          status: 'success',
          postId: result.id,
          releaseUrl: result.url,
        };
      }
      if (result.status === 'inbox') {
        return { status: 'inbox', postId: result.id };
      }
      if (result.status === 'processing') {
        return { status: 'processing' };
      }
      return { status: 'failed' };
    } catch (error) {
      if (error instanceof RefreshToken) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadBody) {
        this.logger.warn(
          `TikTok status check failed (${error.code}): ${error.hint ?? error.message}`,
        );
        throw new BadRequestException(error.hint ?? error.message);
      }
      throw error;
    }
  }

  private async ensureFreshToken(
    account: TikTokAccount,
  ): Promise<TikTokAccount> {
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
}
```

# src/integrations/tiktok/tiktok.schedule.controller.ts

```ts
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Param,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { ScheduleTikTokDto } from './dto/schedule-tiktok.dto';

@Controller('integrations/social/tiktok')
export class TikTokScheduleController {
  constructor(private readonly queue: QueueService) {}

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
      throw new ServiceUnavailableException(
        'Scheduling queue is not configured',
      );
    }

    await this.queue.addDelayed(
      'tiktok.post.at',
      {
        idempotencyKey: body.idempotencyKey,
        userId: trimmedUserId,
        openId: openId.trim(),
        body: body.post,
      },
      when,
    );

    return {
      scheduled: true,
      runAt: when.toISOString(),
      jobKey: body.idempotencyKey,
    };
  }
}
```

# src/integrations/tiktok/tiktok.scheduler.ts

```ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { QueueService } from '../../queue/queue.service';
import { TikTokPostRequestDto } from './dto/post-tiktok.dto';
import { TikTokPostingService } from './tiktok.posting.service';

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
  ) {}

  onModuleInit(): void {
    this.queue.attachWorker(async (payload) => {
      const { userId, openId, body } = payload as ScheduleJobPayload;
      this.logger.log(
        `Executing scheduled TikTok post for user=${userId} openId=${openId}`,
      );
      await this.postingService.post(userId, openId, body);
    });
  }
}
```

# src/integrations/tiktok/tiktok.service.ts

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

  constructor(private readonly repository: TikTokAccountRepository) {}

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

    const rawOpenId =
      userInfo.openId ?? token.openId ?? this.ensureOpenId(token);
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

    const response = await fetch(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      },
    ).catch((error: unknown) => {
      this.logger.error(
        `Failed to reach TikTok token endpoint`,
        error as Error,
      );
      throw new BadRequestException('Unable to reach TikTok token endpoint');
    });

    const payload = await this.safeJson(response);
    const data = this.extractDataObject(payload);

    if (!response.ok) {
      const message =
        (typeof data === 'object' && (data as any)?.message) ||
        (typeof (data as any)?.error_msg === 'string' &&
          (data as any).error_msg) ||
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
        typeof (data as any)?.expires_in === 'number'
          ? (data as any).expires_in
          : null,
      refreshExpiresIn:
        typeof (data as any)?.refresh_expires_in === 'number'
          ? (data as any).refresh_expires_in
          : null,
      scope,
      openId:
        typeof (data as any)?.open_id === 'string'
          ? (data as any).open_id
          : null,
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
      this.logger.error(
        `Failed to reach TikTok user info endpoint`,
        error as Error,
      );
      throw new BadRequestException(
        'Unable to fetch TikTok profile information',
      );
    });

    const payload = await this.safeJson(response);
    const data: any = this.extractDataObject(payload) ?? {};
    const user: any = data?.user ?? {};

    if (!response.ok) {
      const message =
        this.extractErrorMessage(payload) ??
        'TikTok user info retrieval failed';
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
      avatarUrl: typeof user?.avatar_url === 'string' ? user.avatar_url : null,
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

    if (
      typeof payload.message === 'string' &&
      payload.message.trim().length > 0
    ) {
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

  private buildMockAccount(
    dto: ConnectTikTokDto,
    userId: string,
  ): TikTokAccount {
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

# src/integrations/tiktok/tiktok.types.ts

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

# src/main.ts

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

# src/queue/queue.module.ts

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

# src/queue/queue.service.ts

```ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { JobsOptions, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

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
  private queue?: Queue<ScheduleJobPayload>;
  private worker?: Worker<ScheduleJobPayload>;

  async onModuleInit(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.warn(
        'REDIS_URL is not set; scheduling features are disabled',
      );
      return;
    }

    this.connection = new IORedis(redisUrl);
    this.queue = new Queue<ScheduleJobPayload>(
      process.env.POST_SCHEDULE_QUEUE ?? 'tiktok-posts',
      {
        connection: this.connection,
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
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

    const jobId = `${process.env.POST_SCHEDULE_GROUP ?? 'slidescockpit'}:${payload.idempotencyKey}`;
    return this.queue.add(name, payload, {
      jobId,
      delay: Math.max(0, runAt.getTime() - Date.now()),
      removeOnComplete: 500,
      removeOnFail: 1000,
      ...opts,
    });
  }

  attachWorker(
    processor: (payload: ScheduleJobPayload) => Promise<void>,
  ): void {
    if (!this.queue || !this.connection) {
      this.logger.warn('Queue not initialised; worker not attached');
      return;
    }
    if (this.worker) {
      return;
    }

    this.worker = new Worker<ScheduleJobPayload>(
      this.queue.name,
      async (job) => {
        await processor(job.data);
      },
      { connection: this.connection, concurrency: 1 },
    );
  }

  isReady(): boolean {
    return Boolean(this.queue);
  }
}
```

# storage/tiktok-accounts.json

```json
[]
```

# test/app.e2e-spec.ts

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

# test/jest-e2e.json

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
