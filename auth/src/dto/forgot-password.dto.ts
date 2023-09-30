import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
