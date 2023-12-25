import {
  Body,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';

import {
  AuthGuard,
  GetUser,
  UserDetails,
  Roles,
  RolesGuard,
  AdminRoles,
  MaxImageSizeValidator,
} from '@dine_ease/common';

import { FilesInterceptor } from '@nestjs/platform-express';

// Services
import { ReviewService } from './review.service';

// Database
import { ReviewDocument } from './models/review.entity';

// DTO
import { ReviewDto } from './dto/review.dto';
import { PaginationDto } from 'src/restaurant/dto/pagination.dto';
import { ReviewSlugDto } from './dto/review-slug.dto';
import { ReviewIdDto, RestaurantIdDto } from './dto/mongo-id.dto';

@Controller('/api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  async getAllReviews(): Promise<ReviewDocument[]> {
    return this.reviewService.getAllReviews();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUserReviews(
    @GetUser() user: UserDetails,
  ): Promise<ReviewDocument[]> {
    return this.reviewService.getUserReviews(user);
  }

  @Get('/slug/:slug')
  async getReviewBySlug(
    @Param() reviewSlugDto: ReviewSlugDto,
  ): Promise<ReviewDocument> {
    return this.reviewService.getReviewBySlug(reviewSlugDto);
  }

  @Get('rating/:restaurantId')
  @UseGuards(AuthGuard)
  async getRestaurantRating(
    @Param() restaurantIdDto: RestaurantIdDto,
  ): Promise<{ reviewsCount: number; rating: number }> {
    return this.reviewService.getRestaurantRating(restaurantIdDto);
  }

  @Get('/:restaurantId')
  async getRestaurantReviews(
    @Param() id: RestaurantIdDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ count?: number; reviews: ReviewDocument[] }> {
    return this.reviewService.getRestaurantReviews(id, paginationDto);
  }

  @Post('/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadItemImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    files: Express.Multer.File[],
    @Param() reviewIdDto: ReviewIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.reviewService.uploadImages(reviewIdDto, files, user);
  }

  @Post('/:restaurantId')
  @UseGuards(AuthGuard)
  async createReview(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: ReviewDto,
  ): Promise<ReviewDocument> {
    return this.reviewService.createReview(id, user, data);
  }

  @Patch('/:reviewId')
  @UseGuards(AuthGuard)
  async updateReview(
    @Param() id: ReviewIdDto,
    @GetUser() user: UserDetails,
    @Body() data: ReviewDto,
  ): Promise<string> {
    return this.reviewService.updateReview(id, user, data);
  }

  @Delete('/:reviewId')
  @UseGuards(AuthGuard)
  async deleteRestaurant(
    @Param() id: ReviewIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.reviewService.deleteReview(id, user);
  }
}
