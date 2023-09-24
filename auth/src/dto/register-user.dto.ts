import {
  IsEnum,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsMobilePhone,
  IsStrongPassword,
  IsAlphanumeric,
} from 'class-validator';
import { UserRoles } from '@dine_ease/common';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(15)
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(15)
  lastName: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @IsEnum(UserRoles)
  role: UserRoles;
}
