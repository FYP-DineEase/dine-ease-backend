// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { ConfigModule } from './config/config.module';
import { MenuModule } from './menu/menu.module';
import { ModifyModule } from './modify/modify.module';
import { RecordsModule } from './records/records.module';
import { ReviewModule } from './reviews/review.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    MenuModule,
    ModifyModule,
    ReviewModule,
    RecordsModule,
    RestaurantsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
