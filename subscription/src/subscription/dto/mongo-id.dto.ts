import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: Types.ObjectId;
}
