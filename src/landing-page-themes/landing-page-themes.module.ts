import { Module } from '@nestjs/common';
import { LandingPageThemesController } from './landing-page-themes.controller';
import { LandingPageThemesService } from './landing-page-themes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandingPageThemesController],
  providers: [LandingPageThemesService],
})
export class LandingPageThemesModule {}

