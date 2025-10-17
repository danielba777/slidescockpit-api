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
