// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { RedisModule } from './redis/redis.module';
import { TwilioService } from './services/twilio.service';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Restaurant
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './models/restaurant.entity';
import {
  RestaurantRecords,
  RestaurantRecordsSchema,
} from './models/restaurant-records.entity';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    NatsStreamingTransport.register({
      clientId: 'abc5',
      clusterId: 'dine-ease',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
    JwtAuthModule,
    LoggerModule,
    RedisModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-restaurant'),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: RestaurantRecords.name, schema: RestaurantRecordsSchema },
    ]),
  ],
  providers: [RestaurantService, TwilioService, RedisService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
