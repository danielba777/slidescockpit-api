// src/slideshow-library/slideshow-library.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SlideshowAccountsService } from './slideshow-accounts.service';
import { SlideshowPostsService } from './slideshow-posts.service';
import { Express } from 'express';
import { CreateSlideshowAccountDto } from './dto/create-slideshow-account.dto';

@Controller('slideshow-library')
export class SlideshowLibraryController {
  constructor(
    private accountsService: SlideshowAccountsService,
    private postsService: SlideshowPostsService,
  ) {}

  // Accounts
  @Get('accounts')
  async getAllAccounts() {
    return this.accountsService.getAllAccounts();
  }

  @Get('accounts/:id')
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Post('accounts')
  async createAccount(@Body() data: CreateSlideshowAccountDto) {
    return this.accountsService.createAccount(data);
  }

  @Post('accounts/upload-profile')
  @UseInterceptors(FilesInterceptor('profileImage', 1))
  async uploadProfileImage(@UploadedFiles() files: Express.Multer.File[]) {
    const file = files?.[0];
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    const url = await this.accountsService.uploadProfileImage(file);
    return { success: true, url };
  }

  @Put('accounts/:id')
  async updateAccount(@Param('id') id: string, @Body() data: any) {
    return this.accountsService.updateAccount(id, data);
  }

  @Post('accounts/:id/sync')
  async syncAccount(@Param('id') id: string) {
    return this.accountsService.syncAccountData(id);
  }

  // Posts
  @Get('posts')
  async getAllPosts(
    @Query('limit') limit?: number,
    @Query('category') category?: string
  ) {
    return this.postsService.getAllPosts(limit, category);
  }

  @Get('posts/categories')
  async getAllCategories() {
    return this.postsService.getAllCategories();
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Get('accounts/:accountId/posts')
  async getPostsByAccount(
    @Param('accountId') accountId: string,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.getPostsByAccount(accountId, limit);
  }

  @Post('posts')
  async createPost(@Body() data: any) {
    return this.postsService.createPost(data);
  }

  @Post('posts/upload-slides')
  @UseInterceptors(FilesInterceptor('slides', 50))
  async uploadSlides(@UploadedFiles() files: Express.Multer.File[]) {
    return this.postsService.uploadSlides(files);
  }

  @Put('posts/:postId/stats')
  async updatePostStats(@Param('postId') postId: string, @Body() stats: any) {
    return this.postsService.updatePostStats(postId, stats);
  }

  @Put('posts/:postId/reorder')
  async reorderPostSlides(
    @Param('postId') postId: string,
    @Body() body: { slideIds: string[] },
  ) {
    return this.postsService.updateSlideOrder(postId, body.slideIds);
  }

  @Put('posts/:id/prompt')
  async updatePostPrompt(
    @Param('id') id: string,
    @Body() body: { prompt?: string | null },
  ) {
    return this.postsService.updatePostPrompt(id, body.prompt ?? null);
  }

  @Put('posts/:id/categories')
  async updatePostCategories(
    @Param('id') id: string,
    @Body() body: { categories?: string[] },
  ) {
    return this.postsService.updatePostCategories(id, body.categories ?? []);
  }
}
