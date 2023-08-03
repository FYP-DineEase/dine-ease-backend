import { IsString } from 'class-validator';

export class UserTokenDto {
  @IsString()
  token: string;
}
