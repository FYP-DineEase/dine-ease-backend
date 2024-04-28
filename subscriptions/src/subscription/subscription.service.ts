import * as dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';

// NATS
import { Subjects, SubscriptionCreatedEvent } from '@dine_ease/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

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
import { PlanDocument } from 'src/plan/models/plan.entity';
import { RestaurantDocument } from 'src/restaurant/models/restaurant.entity';

// Interfaces
import { PaymentDetails } from './interfaces/payment.interface';

// DTO
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { PaymentIntentDto } from './dto/payment-intent.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly publisher: Publisher,
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

  // create intent
  async createIntent(paymentIntentDto: PaymentIntentDto): Promise<string> {
    const { planId, restaurantId } = paymentIntentDto;

    const restaurant: RestaurantDocument =
      await this.restaurantService.findRestaurantById(restaurantId);

    // check if restaurant is featured
    if (dayjs(restaurant?.featuredTill).isAfter(dayjs())) {
      throw new BadRequestException('Restaurant is already featured');
    }

    const plan: PlanDocument = await this.planService.findPlan(planId);

    // create customerId
    if (!restaurant.customerId) {
      const customerId = await this.stripeService.createCustomer(restaurantId);
      restaurant.set({ customerId });
      restaurant.save();
    }

    // create payment intent
    const paymentDetails: PaymentDetails = {
      customerId: restaurant.customerId,
      currency: plan.currency,
      charges: plan.charges,
    };

    const paymentIntent = await this.stripeService.createPaymentIntent(
      paymentDetails,
    );

    return paymentIntent.client_secret;
  }

  // restaurant featured
  async createSubscription(subscriptionDto: SubscriptionDto): Promise<string> {
    const { planId, restaurantId, stripeId } = subscriptionDto;

    const restaurant: RestaurantDocument =
      await this.restaurantService.findRestaurantById(restaurantId);
    const plan: PlanDocument = await this.planService.findPlan(planId);

    // register subscription
    await this.subscriptionModel.create({
      restaurantId,
      stripeId,
      planId,
    });

    const featuredTill = dayjs().add(plan.durationInMonths, 'month').toDate();

    // update featuredTill
    restaurant.set({ featuredTill });
    await restaurant.save();

    // publish nats event to ( maps, restaurants )
    const event: SubscriptionCreatedEvent = { restaurantId, featuredTill };

    this.publisher.emit<void, SubscriptionCreatedEvent>(
      Subjects.SubscriptionCreated,
      event,
    );

    return 'Restaurant Featured Successfully';
  }
}
