import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LandingPageThemesService {
  constructor(private prisma: PrismaService) {}

  async createTheme(data: {
    category: string;
    heroTitle: string;
    heroSubtitle?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) {
    return this.prisma.landingPageTheme.create({
      data,
    });
  }

  async getAllThemes() {
    return this.prisma.landingPageTheme.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getThemeByCategory(category: string) {
    return this.prisma.landingPageTheme.findUnique({
      where: { category },
    });
  }

  async getThemeById(id: string) {
    return this.prisma.landingPageTheme.findUnique({
      where: { id },
    });
  }

  async updateTheme(
    id: string,
    data: {
      category?: string;
      heroTitle?: string;
      heroSubtitle?: string;
      description?: string;
      metaTitle?: string;
      metaDescription?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.landingPageTheme.update({
      where: { id },
      data,
    });
  }

  async deleteTheme(id: string) {
    return this.prisma.landingPageTheme.delete({
      where: { id },
    });
  }
}

