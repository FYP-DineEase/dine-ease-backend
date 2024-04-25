import { Injectable } from '@nestjs/common';

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

    // check user id
    // check featuredDate ( if already featured throw ex )

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

    await this.restaurantService.findRestaurantById(restaurantId);
    await this.planService.findPlan(planId);

    // register subscription
    await this.subscriptionModel.create({
      restaurantId,
      stripeId,
      planId,
    });

    // publish nats event to ( maps, restaurants )

    // const event: AccountCreatedEvent = {
    //   userId: newUser.id,
    //   slug: nanoid(10),
    //   firstName,
    //   lastName,
    //   name: `${firstName} ${lastName}`,
    //   email,
    //   role,
    // };

    // this.publisher.emit<void, AccountCreatedEvent>(
    //   Subjects.AccountCreated,
    //   event,
    // );

    return 'Restaurant Featured Successfully';
  }
}
