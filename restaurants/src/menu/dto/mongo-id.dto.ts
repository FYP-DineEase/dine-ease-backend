import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: Types.ObjectId;
}

export class MenuIdDto extends RestaurantIdDto {
  @IsMongoId()
  menuId: Types.ObjectId;
}
