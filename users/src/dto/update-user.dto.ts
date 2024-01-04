import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { IsCoordinates } from 'src/decorators/coordinates.decorator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  description: string;

  @IsOptional()
  @IsCoordinates()
  location: {
    country: string;
    coordinates: [number, number];
  };
}
