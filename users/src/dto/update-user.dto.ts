import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsAlpha,
} from 'class-validator';
import { IsCoordinates } from 'src/decorators/coordinates.decorator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(20)
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
