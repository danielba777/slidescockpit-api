import { Body, Controller, Get, Post } from '@nestjs/common';

import { SessionService } from '../../common/session/session.service';
import { ConnectTikTokDto } from './dto/connect-tiktok.dto';
import { TikTokService } from './tiktok.service';

const FLOW_ID = 'tiktok:public';

@Controller('integrations/social/tiktok')
export class TikTokController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly tikTokService: TikTokService,
  ) {}

  @Get()
  start() {
    const pendingState = this.sessionService.registerState(FLOW_ID);
    return this.tikTokService.start(pendingState.state);
  }

  @Post('connect')
  async connect(@Body() dto: ConnectTikTokDto) {
    this.sessionService.consumeState(FLOW_ID, dto.state);
    const account = await this.tikTokService.connect(dto);
    const { accessToken, refreshToken, ...publicAccount } = account;

    return {
      success: true,
      account: publicAccount,
    };
  }
}
