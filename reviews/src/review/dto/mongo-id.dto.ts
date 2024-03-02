import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ReviewIdDto {
  @IsMongoId()
  reviewId: Types.ObjectId;
}

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: Types.ObjectId;
}

export class UserIdDto {
  @IsMongoId()
  userId: Types.ObjectId;
}
