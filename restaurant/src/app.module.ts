// Modules
import { Module } from '@nestjs/common';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  ConfigModule,
} from '@dine_ease/common';
import { MenuModule } from './menu/menu.module';
import { ModifyModule } from './modify/modify.module';
import { RecordsModule } from './records/records.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    MenuModule,
    ModifyModule,
    RecordsModule,
    RestaurantsModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-restaurant'),
  ],
})
export class AppModule {}
