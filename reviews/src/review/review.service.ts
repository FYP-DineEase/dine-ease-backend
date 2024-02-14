import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails, AdminRoles, ReviewDeletedEvent } from '@dine_ease/common';
import { nanoid } from 'nanoid';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  ReviewCreatedEvent,
  ReviewUpdatedEvent,
} from '@dine_ease/common';

// Services
import { S3Service } from 'src/services/aws-s3.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './models/review.entity';

// DTO
import { ReviewDto } from './dto/review.dto';
import { ReviewSlugDto } from './dto/review-slug.dto';
import { PaginationDto } from 'src/restaurant/dto/pagination.dto';
import { ReviewIdDto, RestaurantIdDto } from './dto/mongo-id.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly publisher: Publisher,
    private readonly s3Service: S3Service,
    private readonly restaurantService: RestaurantService,
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  // get approved restaurants count
  async getApprovedCount(): Promise<number> {
    return this.reviewModel.countDocuments({
      isDeleted: false,
    });
  }

  // get all reviews
  async getAllReviews(): Promise<ReviewDocument[]> {
    const reviews: ReviewDocument[] = await this.reviewModel.find();
    return reviews;
  }

  // get user reviews
  async getUserReviews(user: UserDetails): Promise<ReviewDocument[]> {
    const reviews: ReviewDocument[] = await this.reviewModel
      .find({
        userId: user.id,
      })
      .populate({
        path: 'votes',
        model: 'Vote',
      });
    return reviews;
  }

  // get review by slug
  async getReviewById(reviewId: Types.ObjectId): Promise<ReviewDocument> {
    const review: ReviewDocument = await this.reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  // get review by slug
  async getReviewBySlug(reviewSlugDto: ReviewSlugDto): Promise<ReviewDocument> {
    const { slug } = reviewSlugDto;
    const review: ReviewDocument = await this.reviewModel
      .findOne({
        slug,
        isDeleted: false,
      })
      .populate({
        path: 'votes',
        model: 'Vote',
      });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  // get restaurant reviews
  async getRestaurantReviews(
    restaurantIdDto: RestaurantIdDto,
    paginationDto: PaginationDto,
  ): Promise<{ count?: number; reviews: ReviewDocument[] }> {
    let count: number;
    const { restaurantId } = restaurantIdDto;
    const { offset, limit } = paginationDto;

    if (offset == 0) {
      count = await this.getApprovedCount();
    }

    const reviews: ReviewDocument[] = await this.reviewModel
      .find({ restaurantId, isDeleted: false })
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'votes',
        model: 'Vote',
      });

    return { count, reviews };
  }

  // create a review
  async createReview(
    restaurantDto: RestaurantIdDto,
    user: UserDetails,
    reviewDto: ReviewDto,
    files: Express.Multer.File[],
  ): Promise<ReviewDocument> {
    const { restaurantId } = restaurantDto;
    const { content, rating: numberRating } = reviewDto;
    const rating = Number(numberRating);

    await this.restaurantService.findRestaurantById(restaurantId);

    const review: ReviewDocument = await this.reviewModel.create({
      userId: user.id,
      slug: nanoid(10),
      restaurantId,
      content,
      rating,
    });

    const path = `${restaurantId}/${review.id}`;

    const uploadPromises = files.map(async (file) => {
      const data = await this.s3Service.upload(path, file);
      review.images.push(data);
    });

    await Promise.all(uploadPromises);
    await review.save();

    // publish created event
    const event: ReviewCreatedEvent = {
      id: review.id,
      userId: user.id,
      restaurantId,
      rating,
      content,
    };

    this.publisher.emit<void, ReviewCreatedEvent>(
      Subjects.ReviewCreated,
      event,
    );

    return review;
  }

  // upload review images
  async updateReview(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    reviewDto: ReviewDto,
    files: Express.Multer.File[],
  ): Promise<ReviewDocument> {
    const { reviewId } = reviewIdDto;
    const { content, rating: numberRating, deletedImages } = reviewDto;
    const rating = Number(numberRating);

    const found: ReviewDocument = await this.getReviewById(reviewId);
    const previousRating = found.rating;

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (found.images.length - deletedImages?.length + files.length > 10) {
      throw new BadRequestException('Only 10 images are allowed');
    }

    // bucket path
    const path = `${found.restaurantId}/${reviewId}`;

    // upload images
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const data = await this.s3Service.upload(path, file);
        found.images.push(data);
      });

      await Promise.all(uploadPromises);
    }

    // delete images
    if (deletedImages?.length > 0) {
      await this.s3Service.deleteMany(path, deletedImages);

      const filteredImages = found.images.filter(
        (v) => !deletedImages.includes(v),
      );
      found.set({ images: filteredImages });
    }

    found.set({ content, rating });
    await found.save();

    // publish updated event
    const event: ReviewUpdatedEvent = {
      id: found.id,
      restaurantId: found.restaurantId,
      rating,
      previousRating,
      content,
      version: found.version,
    };

    this.publisher.emit<void, ReviewUpdatedEvent>(
      Subjects.ReviewUpdated,
      event,
    );

    return found;
  }

  // delete a review
  async deleteReview(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;

    const review: ReviewDocument = await this.getReviewById(reviewId);

    if (review.userId === user.id || user.role === AdminRoles.ADMIN) {
      review.set({ isDeleted: true });
      await review.save();

      // publish deleted event
      const event: ReviewDeletedEvent = {
        id: review.id,
        restaurantId: review.restaurantId,
        rating: review.rating,
        version: review.version,
      };

      this.publisher.emit<void, ReviewDeletedEvent>(
        Subjects.ReviewDeleted,
        event,
      );

      return 'Review deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
