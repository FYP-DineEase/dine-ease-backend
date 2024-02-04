import { IsMongoId } from 'class-validator';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: string;
}

export class MenuIdDto extends RestaurantIdDto {
  @IsMongoId()
  menuId: string;
}
