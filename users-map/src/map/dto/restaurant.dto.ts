import { IsMongoId } from 'class-validator';

export class RestaurantDto {
  @IsMongoId()
  restaurantId: string;
}
