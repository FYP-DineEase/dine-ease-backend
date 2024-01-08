import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RestaurantSlugDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  slug: string;
}
