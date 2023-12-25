// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Map, MapSchema } from './models/map.entity';
import { RestuarantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
    RestuarantModule,
    MongooseModule.forFeature([{ name: Map.name, schema: MapSchema }]),
  ],
  providers: [MapService],
  controllers: [MapController],
})
export class MapModule {}
