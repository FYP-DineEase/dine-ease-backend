import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { IsCoordinates } from '../decorators/coordinates.decorator';
import { PrimaryDetailsDto } from './primary-details.dto';

export class RestaurantDto extends PrimaryDetailsDto {
  @IsString()
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
    country: string;
    coordinates: [number, number];
  };
}
