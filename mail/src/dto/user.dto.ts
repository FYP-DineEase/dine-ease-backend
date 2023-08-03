import { IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsString()
  @IsEmail()
  email: string;
}
