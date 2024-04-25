import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class PaymentIntentDto {
  @IsMongoId()
  planId: Types.ObjectId;

  @IsMongoId()
  restaurantId: Types.ObjectId;
}
