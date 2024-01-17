// Modules
import { Module } from '@nestjs/common';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  ConfigModule,
} from '@dine_ease/common';
import { PlanModule } from './plan/plan.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    PlanModule,
    RestaurantModule,
    SubscriptionModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-subscription'),
  ],
})
export class AppModule {}
