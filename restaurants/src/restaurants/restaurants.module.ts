// Modules
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/redis/redis.module';
import { ModifyModule } from 'src/modify/modify.module';
import { RecordsModule } from 'src/records/records.module';
import { ReviewModule } from 'src/reviews/review.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Services
import { S3Service } from '../services/aws-s3.service';
import { RedisService } from 'src/redis/redis.service';
import { ReviewService } from 'src/reviews/review.service';
import { TwilioService } from 'src/services/twilio.service';

// Restaurant
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, RestaurantSchema } from './models/restaurant.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    RedisModule,
    ModifyModule,
    RecordsModule,
    forwardRef(() => ReviewModule),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [S3Service, TwilioService, RedisService, RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
