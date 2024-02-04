// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanModule } from 'src/plan/plan.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

// Services
import { StripeService } from 'src/services/stripe.service';
import { SubscriptionService } from './subscription.service';

import { SubscriptionController } from './subscription.controller';
import { Subscription, SubscriptionSchema } from './models/subscription.entity';

@Module({
  imports: [
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
