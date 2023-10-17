// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';

import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Restaurant, RestaurantSchema } from './models/restaurant.entity';

@Module({
  imports: [
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-restaurant'),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
