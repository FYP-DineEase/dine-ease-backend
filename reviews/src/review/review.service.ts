import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails, AdminRoles } from '@dine_ease/common';
import { nanoid } from 'nanoid';

// Services
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
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
    private readonly restaurantService: RestaurantService,
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

  // get rating
  async getRestaurantRating(
    restaurantIdDto: RestaurantIdDto,
  ): Promise<{ reviewsCount: number; rating: number }> {
    const { restaurantId } = restaurantIdDto;

    const result = await this.reviewModel.aggregate([
      { $match: { restaurantId, isDeleted: false } },
      {
        $group: {
          _id: restaurantId,
          rating: { $avg: '$rating' },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0 ? result[0] : { reviewsCount: 0, rating: 0 };
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
  ): Promise<ReviewDocument> {
    const { restaurantId } = restaurantDto;
    const { content, rating } = reviewDto;

    await this.restaurantService.findRestaurantById(restaurantId);

    const review: ReviewDocument = await this.reviewModel.create({
      userId: user.id,
      slug: nanoid(10),
      restaurantId,
      content,
      rating,
    });
    return review;
  }

  // upload review images
  async uploadImages(
    reviewIdDto: ReviewIdDto,
    files: Express.Multer.File[],
    user: UserDetails,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;
    const found: ReviewDocument = await this.getReviewById(reviewId);

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (found.images.length + files.length > 10) {
      throw new BadRequestException('Only 10 images are allowed');
    }

    // const results = await Promise.allSettled(
    //   files.map((file) => this.s3Service.upload(reviewId, file)),
    // );

    // const successfulUploads = [];

    // for (const result of results) {
    //   if (result.status === 'fulfilled') {
    //     successfulUploads.push(result.value);
    //   }
    // }

    // found.images.push(...successfulUploads);
    // await found.save();

    return 'Review Images Updated Successfully';
  }

  // update a review
  async updateReview(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    reviewDto: ReviewDto,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;
    const { content, rating } = reviewDto;

    const review: ReviewDocument = await this.getReviewById(reviewId);

    if (review.userId === user.id) {
      review.set({ content, rating });
      await review.save();
      return 'Review updated successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }

  // delete review images
  // async deleteImages(
  //   idDto: RestaurantIdDto,
  //   data: DeleteImagesDto,
  //   user: UserDetails,
  // ): Promise<string> {
  //   const { images } = data;

  //   const found: RestaurantDocument = await this.findRestaurantById(idDto);

  //   if (found.userId !== user.id) {
  //     throw new UnauthorizedException('User is not authorized');
  //   }

  //   const path = `${idDto.restaurantId}/images`;
  //   await this.s3Service.deleteMany(path, images);

  //   const filteredImages = found.images.filter((v) => !images.includes(v));
  //   found.set({ images: filteredImages });
  //   await found.save();

  //   return 'Restaurant Image Deleted Successfully';
  // }

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
      return 'Review deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
