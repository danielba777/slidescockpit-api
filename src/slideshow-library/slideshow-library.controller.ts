// src/slideshow-library/slideshow-library.controller.ts
import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { SlideshowAccountsService } from './slideshow-accounts.service';
import { SlideshowPostsService } from './slideshow-posts.service';

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
  async createAccount(@Body() data: any) {
    return this.accountsService.createAccount(data);
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
  async getAllPosts(@Query('limit') limit?: number) {
    return this.postsService.getAllPosts(limit);
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

  @Put('posts/:postId/stats')
  async updatePostStats(@Param('postId') postId: string, @Body() stats: any) {
    return this.postsService.updatePostStats(postId, stats);
  }
}
