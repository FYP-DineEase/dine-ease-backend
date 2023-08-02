import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UserPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message:
      'password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
