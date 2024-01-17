import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './models/review.entity';

@Module({
  imports: [
    RestaurantModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  exports: [ReviewService],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
