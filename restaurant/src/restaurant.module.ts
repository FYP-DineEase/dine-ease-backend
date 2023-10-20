// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { RedisModule } from './redis/redis.module';
import { TwilioService } from './services/twilio.service';

// Restaurant
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './models/restaurant.entity';
import {
  RestaurantApproval,
  RestaurantApprovalSchema,
} from './models/restaurant-approval.entity';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    JwtAuthModule,
    LoggerModule,
    RedisModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-restaurant'),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: RestaurantApproval.name, schema: RestaurantApprovalSchema },
    ]),
  ],
  providers: [RestaurantService, TwilioService, RedisService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
