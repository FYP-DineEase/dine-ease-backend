import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  GetUser,
  UserDetails,
  Roles,
  RolesGuard,
  AdminRoles,
} from '@dine_ease/common';

// Restaurant
import { ReviewService } from './review.service';
import { ReviewDocument } from './models/review.entity';

// DTO
import { ReviewDto } from './dto/review.dto';
import { ReviewIdDto, RestaurantIdDto } from './dto/mongo-id.dto';

@Controller('/api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  getAllReviews(): Promise<ReviewDocument[]> {
    return this.reviewService.getAllReviews();
  }

  @Get('/restaurant/:restaurantId')
  getRestaurantReviews(
    @Param() id: RestaurantIdDto,
  ): Promise<ReviewDocument[]> {
    return this.reviewService.getRestaurantReviews(id);
  }

  @Get('/:reviewId')
  getReviewById(@Param() id: ReviewIdDto): Promise<ReviewDocument> {
    return this.reviewService.getReviewById(id);
  }

  @Post('/create/:restaurantId')
  @UseGuards(AuthGuard)
  createRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: ReviewDto,
  ): Promise<ReviewDocument> {
    return this.reviewService.createReview(id, user, data);
  }

  @Patch('/:reviewId')
  @UseGuards(AuthGuard)
  updateRestaurant(
    @Param() id: ReviewIdDto,
    @GetUser() user: UserDetails,
    @Body() data: ReviewDto,
  ): Promise<string> {
    return this.reviewService.updateReview(id, user, data);
  }

  @Delete('/:reviewId')
  @UseGuards(AuthGuard)
  deleteRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.reviewService.deleteReview(id, user);
  }
}
