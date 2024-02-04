import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PaymentDto } from './payment.dto';

export class SubscriptionDto extends PaymentDto {
  @IsMongoId()
  planId: Types.ObjectId;
}
