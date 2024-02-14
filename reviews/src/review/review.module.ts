// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Services
import { S3Service } from 'src/services/aws-s3.service';

// Review
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review, ReviewSchema } from './models/review.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    RestaurantModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  exports: [ReviewService],
  providers: [S3Service, ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
