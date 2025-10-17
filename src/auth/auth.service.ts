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

