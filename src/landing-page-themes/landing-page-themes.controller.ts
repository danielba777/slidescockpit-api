import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LandingPageThemesService } from './landing-page-themes.service';

@Controller('landing-page-themes')
export class LandingPageThemesController {
  constructor(private themesService: LandingPageThemesService) {}

  @Get()
  async getAllThemes() {
    return this.themesService.getAllThemes();
  }

  @Get('category/:category')
  async getThemeByCategory(@Param('category') category: string) {
    return this.themesService.getThemeByCategory(category);
  }

  @Get(':id')
  async getThemeById(@Param('id') id: string) {
    return this.themesService.getThemeById(id);
  }

  @Post()
  async createTheme(@Body() data: any) {
    return this.themesService.createTheme(data);
  }

  @Put(':id')
  async updateTheme(@Param('id') id: string, @Body() data: any) {
    return this.themesService.updateTheme(id, data);
  }

  @Delete(':id')
  async deleteTheme(@Param('id') id: string) {
    return this.themesService.deleteTheme(id);
  }
}

