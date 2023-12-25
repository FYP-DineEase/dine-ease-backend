import {
  IsEnum,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsStrongPassword,
  IsEmail,
} from 'class-validator';
import { UserRoles } from '@dine_ease/common';

export class RegisterUserDto {
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
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsEnum(UserRoles)
  role: UserRoles;
}
