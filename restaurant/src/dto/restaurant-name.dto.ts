import { IsString, IsNotEmpty } from 'class-validator';

export class RestaurantNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
