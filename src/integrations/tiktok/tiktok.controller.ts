import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { SessionService } from '../../common/session/session.service';
import { ConnectTikTokDto } from './dto/connect-tiktok.dto';
import { TikTokService } from './tiktok.service';
import { TikTokAccountRepository } from './tiktok-account.repository';

@Controller('integrations/social/tiktok')
export class TikTokController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly tikTokService: TikTokService,
    private readonly tikTokAccountRepository: TikTokAccountRepository,
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

  @Delete(':openId/disconnect')
  async disconnectAccount(
    @Headers('x-user-id') userId: string,
    @Param('openId') openId: string,
  ) {
    const resolvedUserId = this.ensureUserId(userId);
    const normalizedOpenId = openId.trim();

    const deleted = await this.tikTokAccountRepository.deleteAccount(
      resolvedUserId,
      normalizedOpenId,
    );

    return {
      success: true,
      deleted: deleted > 0,
    };
  }

  private ensureUserId(userId: string | undefined): string {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new BadRequestException('Missing x-user-id header');
    }
    return userId.trim();
  }
}
