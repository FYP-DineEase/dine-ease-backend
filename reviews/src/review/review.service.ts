import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails, AdminRoles } from '@dine_ease/common';

// Logger
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './models/review.entity';

// DTO
import { ReviewDto } from './dto/review.dto';
import { ReviewIdDto, RestaurantIdDto } from './dto/mongo-id.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  // get all reviews
  async getAllReviews(): Promise<ReviewDocument[]> {
    const review: ReviewDocument[] = await this.reviewModel.find();
    return review;
  }

  // get all restaurant reviews
  async getRestaurantReviews(
    restaurantIdDto: RestaurantIdDto,
  ): Promise<ReviewDocument[]> {
    const { restaurantId } = restaurantIdDto;
    const reviews: ReviewDocument[] = await this.reviewModel.find({
      restaurantId,
    });
    return reviews;
  }

  // get review by Id
  async getReviewById(reviewIdDto: ReviewIdDto): Promise<ReviewDocument> {
    const { reviewId } = reviewIdDto;
    const reviews: ReviewDocument = await this.reviewModel.findById(reviewId);
    return reviews;
  }

  // create a review
  async createReview(
    restaurantIdDto: RestaurantIdDto,
    user: UserDetails,
    data: ReviewDto,
  ): Promise<ReviewDocument> {
    const { restaurantId } = restaurantIdDto;
    // find restaurant
    // if not found throw error
    const payload = { userId: user.id, ...data };
    const review: ReviewDocument = await this.reviewModel.create(payload);
    return review;
  }

  // update a review
  async updateReview(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    data: ReviewDto,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;

    const review: ReviewDocument = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    if (review.userId === user.id) {
      review.set(data);
      return 'Review updated successfully';
    }

    this.logger.warn(
      `User: ${user.id} attempted to update Review: ${review.id}`,
    );
    throw new UnauthorizedException('User is not authorized');
  }

  // delete a review
  async deleteReview(
    restaurantIdDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const { restaurantId } = restaurantIdDto;

    const review: ReviewDocument = await this.reviewModel.findById(
      restaurantId,
    );
    if (!review) throw new NotFoundException('Review not found');

    if (review.userId === user.id || user.role === AdminRoles.ADMIN) {
      review.set({ isDeleted: true });
      await review.save();
      this.logger.info(`User: ${user.id} deleted the Review: ${review.id}`);
      return 'Restaurant deleted successfully';
    }

    this.logger.warn(
      `User: ${user.id} attempted to delete Restaurant: ${review.id}`,
    );
    throw new UnauthorizedException('User is not authorized');
  }
}
