import { UserDto } from './user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
