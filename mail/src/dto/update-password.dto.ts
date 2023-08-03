import { UserDto } from './user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
