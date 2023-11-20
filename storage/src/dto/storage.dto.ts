import { IsEnum } from 'class-validator';
import {
  UserStorage,
  RestaurantStorage,
  ReviewStorage,
} from '@dine_ease/common';

export class UserStorageDto {
  @IsEnum(UserStorage)
  type: UserStorage;
}

export class RestaurantStorageDto {
  @IsEnum(RestaurantStorage)
  type: RestaurantStorage;
}

export class ReviewStorageDto {
  @IsEnum(ReviewStorage)
  type: ReviewStorage;
}
