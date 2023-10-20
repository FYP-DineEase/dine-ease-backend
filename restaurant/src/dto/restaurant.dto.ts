import {
  IsString,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
  IsPhoneNumber,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  cuisine: string[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  taxId: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
