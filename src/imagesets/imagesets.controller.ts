// src/imagesets/imagesets.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesetsService } from './imagesets.service';

@Controller('imagesets')
export class ImagesetsController {
  constructor(private readonly imagesetsService: ImagesetsService) {}

  @Get()
  async getAllImageSets() {
    return this.imagesetsService.getAllImageSets();
  }

  @Get(':id')
  async getImageSetById(@Param('id') id: string) {
    return this.imagesetsService.getImageSetById(id);
  }

  @Post()
  async createImageSet(
    @Body() data: { name: string; description?: string; category: string },
  ) {
    return this.imagesetsService.createImageSet(data);
  }

  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('images', 20)) // Max 20 Bilder
  async uploadImages(
    @Param('id') imageSetId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesetsService.uploadImagesToSet(imageSetId, files);
  }

  @Post(':id/images')
  async createImagesFromExternalUrls(
    @Param('id') imageSetId: string,
    @Body()
    body: { images?: { url: string; filename?: string; originalFilename?: string }[] },
  ) {
    const items = Array.isArray(body?.images) ? body!.images! : [];
    return this.imagesetsService.createImagesFromExternalUrls(imageSetId, items);
  }


  @Get(':id/random-image')
  async getRandomImage(@Param('id') imageSetId: string) {
    const image = await this.imagesetsService.getRandomImageFromSet(imageSetId);
    if (!image) {
      return { success: false, error: 'No images found in this set' };
    }
    return { success: true, imageUrl: image.url };
  }

  @Put(':id')
  async updateImageSet(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      description?: string;
      category?: string;
      isActive?: boolean;
    },
  ) {
    return this.imagesetsService.updateImageSet(id, data);
  }

  @Delete(':id')
  async deleteImageSet(@Param('id') id: string) {
    return this.imagesetsService.deleteImageSet(id);
  }

  @Delete('images/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    return this.imagesetsService.deleteImage(imageId);
  }
}
