import { Injectable } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Services
import { PlanService } from 'src/plan/plan.service';
import { StripeService } from 'src/services/stripe.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './models/subscription.entity';

// DTO
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import { Restaurant } from 'src/restaurant/models/restaurant.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly planService: PlanService,
    private readonly stripeService: StripeService,
    private readonly restaurantService: RestaurantService,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  // all subscriptions
  async getSubscriptions(): Promise<SubscriptionDocument[]> {
    const subscriptions: SubscriptionDocument[] =
      await this.subscriptionModel.find();
    return subscriptions;
  }

  // subscriptions by restaurantId
  async getRestaurantSubscriptions(
    idDto: RestaurantIdDto,
  ): Promise<SubscriptionDocument[]> {
    const { restaurantId } = idDto;
    const subscriptions: SubscriptionDocument[] =
      await this.subscriptionModel.find({ restaurantId });
    return subscriptions;
  }

  // restaurant subscription
  async createSubscription(
    idDto: RestaurantIdDto,
    subscriptionDto: SubscriptionDto,
    user: UserDetails,
  ): Promise<string> {
    const { restaurantId } = idDto;
    const { planId, charges } = subscriptionDto;

    const restaurant: Restaurant =
      await this.restaurantService.findRestaurantById(restaurantId);

    // const paymentIntent = await this.stripeService.createPayment({
    //   charges,
    // });

    // await this.subscriptionModel.create({
    //   userId: user.id,
    //   restaurantId,
    //   stripeId: charge.id,
    //   planId,
    // });

    // emit featured restaurant event here

    return 'Subscription created successfully';
  }
}
