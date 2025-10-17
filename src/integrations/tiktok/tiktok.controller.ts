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
    return this.tikTokService.start(pendingState.state);
  }

  @Post('connect')
  async connect(@Headers('x-user-id') userId: string, @Body() dto: ConnectTikTokDto) {
    const resolvedUserId = this.ensureUserId(userId);
    this.sessionService.consumeState(resolvedUserId, dto.state);
    const account = await this.tikTokService.connect(resolvedUserId, dto);
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
