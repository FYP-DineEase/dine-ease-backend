// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/redis/redis.module';
import { ModifyModule } from 'src/modify/modify.module';
import { RecordsModule } from 'src/records/records.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Services
import { RedisService } from 'src/redis/redis.service';
import { TwilioService } from 'src/services/twilio.service';

// Restaurant
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, RestaurantSchema } from './models/restaurant.entity';
import { S3Service } from '../services/aws-s3.service';

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
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [S3Service, TwilioService, RedisService, RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
