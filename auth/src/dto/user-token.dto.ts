import { IsNotEmpty, IsString } from 'class-validator';

export class UserTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
