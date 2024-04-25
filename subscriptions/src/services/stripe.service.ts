import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

// Interface
import { PaymentDetails } from 'src/subscription/interfaces/payment.interface';

@Injectable()
export class StripeService {
  private stripeClient: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(configService.get<string>('STRIPE_SECRET'));
  }

  async createCustomer(restaurantId: Types.ObjectId): Promise<string> {
    const customer = await this.stripeClient.customers.create({
      metadata: { restaurantId: restaurantId.toString() },
    });
    return customer.id;
  }

  createPaymentIntent(paymentDetails: PaymentDetails): Promise<any> {
    const { charges, currency, customerId } = paymentDetails;

    return this.stripeClient.paymentIntents.create({
      amount: charges * 100,
      currency,
      customer: customerId,
    });
  }
}
