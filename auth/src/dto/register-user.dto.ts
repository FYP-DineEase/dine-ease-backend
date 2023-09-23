import {
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsMobilePhone,
  IsStrongPassword,
} from 'class-validator';
import { UserRoles } from '@dine-ease/common';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @IsEnum(UserRoles)
  role: UserRoles;
}
