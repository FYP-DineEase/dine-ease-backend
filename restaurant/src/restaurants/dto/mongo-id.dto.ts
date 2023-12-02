import { IsMongoId } from 'class-validator';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: string;
}