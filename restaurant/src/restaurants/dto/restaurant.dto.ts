import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsPhoneNumber,
} from 'class-validator';
import { IsCoordinates } from '../decorators/coordinates.decorator';
import { PrimaryDetailsDto } from './primary-details.dto';

export class RestaurantDto extends PrimaryDetailsDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  cuisine: string[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsCoordinates()
  location: {
    coordinates: [number, number];
  };
}
