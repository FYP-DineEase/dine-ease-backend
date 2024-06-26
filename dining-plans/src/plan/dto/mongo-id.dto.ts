import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: Types.ObjectId;
}

export class PlanIdDto {
  @IsMongoId()
  planId: Types.ObjectId;
}

export class UserIdDto {
  @IsMongoId()
  userId: Types.ObjectId;
}
