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
