import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// DTO
import { PaymentDto } from 'src/subscription/dto/payment.dto';

@Injectable()
export class StripeService {
  private stripeClient: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(configService.get<string>('STRIPE_SECRET'));
  }

  createPayment(paymentDto: PaymentDto): Promise<any> {
    const { charges } = paymentDto;
    return this.stripeClient.paymentIntents.create({
      amount: charges * 100,
      currency: 'usd',
    });
  }
}
