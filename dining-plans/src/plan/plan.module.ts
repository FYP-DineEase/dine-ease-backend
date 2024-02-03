// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan, PlanSchema } from './models/plan.entity';

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
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
