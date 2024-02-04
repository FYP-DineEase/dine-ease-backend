import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuService } from './menu.service';
import { S3Service } from 'src/services/aws-s3.service';
import { MenuController } from './menu.controller';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { MenuItem, MenuItemSchema } from './models/menu.entity';

@Module({
  imports: [
    RestaurantsModule,
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [S3Service, MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}
