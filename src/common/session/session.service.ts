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
