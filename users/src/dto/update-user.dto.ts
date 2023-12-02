import { MinLength, MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { UpdateLocationDto } from './update-location.dto';

export class UpdateUserDto extends UpdateLocationDto {
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
}
