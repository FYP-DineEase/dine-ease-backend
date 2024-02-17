import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  Length,
  IsOptional,
} from 'class-validator';
import { IsCoordinates } from '../decorators/coordinates.decorator';
import { PrimaryDetailsDto } from './primary-details.dto';

export class RestaurantDto extends PrimaryDetailsDto {
  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  phoneNumber: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[];

  @IsString()
  @IsNotEmpty()
  // @Length(10, 100)
  address: string;

  @IsCoordinates()
  location: {
    country: string;
    coordinates: [number, number];
  };
}
