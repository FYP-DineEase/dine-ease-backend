// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanModule } from 'src/plan/plan.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Services
import { StripeService } from 'src/services/stripe.service';
import { SubscriptionService } from './subscription.service';

// Controller
import { SubscriptionController } from './subscription.controller';

// Database
import { Subscription, SubscriptionSchema } from './models/subscription.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    PlanModule,
    RestaurantModule,
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [StripeService, SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
