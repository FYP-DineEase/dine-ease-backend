import {
  IsString,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
  IsPhoneNumber,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cuisine: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  taxId: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
