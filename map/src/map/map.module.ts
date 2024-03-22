// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Map, MapSchema } from './models/map.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    RestaurantModule,
    MongooseModule.forFeature([{ name: Map.name, schema: MapSchema }]),
  ],
  providers: [MapService],
  controllers: [MapController],
})
export class MapModule {}
