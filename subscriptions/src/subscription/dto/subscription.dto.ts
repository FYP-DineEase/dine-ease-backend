import { PaymentIntentDto } from './payment-intent.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriptionDto extends PaymentIntentDto {
  @IsNotEmpty()
  @IsString()
  stripeId: string;
}
