// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { ReviewModule } from './review/review.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    ReviewModule,
    UserModule,
    VoteModule,
    RestaurantModule,
    DatabaseModule,
  ],
})
export class AppModule {}
