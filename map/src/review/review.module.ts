// Modules
import { Module } from '@nestjs/common';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [RestaurantModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
