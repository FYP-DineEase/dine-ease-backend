// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    JwtAuthModule,
    LoggerModule,
    RestaurantModule,
    MapModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-map'),
  ],
})
export class AppModule {}
