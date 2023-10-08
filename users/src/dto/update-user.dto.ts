import { IsAlpha, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
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
}
