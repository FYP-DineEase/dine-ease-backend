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

export class VoteIdDto extends PlanIdDto {
  @IsMongoId()
  voteId: Types.ObjectId;
}
