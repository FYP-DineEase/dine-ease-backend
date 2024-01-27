// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    JwtAuthModule,
    LoggerModule,
    PlanModule,
    RestaurantModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-dining-plans'),
  ],
})
export class AppModule {}
