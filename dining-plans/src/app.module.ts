// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { ConfigModule } from './config/config.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    UserModule,
    PlanModule,
    RestaurantModule,
    DatabaseModule,
  ],
})
export class AppModule {}
