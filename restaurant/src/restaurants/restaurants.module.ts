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

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: 'abc5',
      clusterId: 'dine-ease',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
    RedisModule,
    ModifyModule,
    RecordsModule,
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantsService, TwilioService, RedisService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
