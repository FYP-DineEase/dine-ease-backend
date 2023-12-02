import { IsMongoId } from 'class-validator';

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: string;
}

export class RequestIdDto {
  @IsMongoId()
  requestId: string;
}
