import { IsString, IsEmail } from 'class-validator';

export class UserEmailDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
