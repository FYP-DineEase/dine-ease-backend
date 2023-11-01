import { IsMongoId } from 'class-validator';

export class ReviewIdDto {
  @IsMongoId()
  reviewId: string;
}

export class RestaurantIdDto {
  @IsMongoId()
  restaurantId: string;
}
