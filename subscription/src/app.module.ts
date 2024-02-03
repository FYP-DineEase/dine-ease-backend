// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { ConfigModule } from './config/config.module';
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
    DatabaseModule,
  ],
})
export class AppModule {}
