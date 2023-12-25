import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestuarantModule } from 'src/restaurant/restaurant.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './models/review.entity';

@Module({
  imports: [
    RestuarantModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  exports: [ReviewService],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
