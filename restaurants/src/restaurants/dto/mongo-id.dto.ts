import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: Types.ObjectId;
}
