import { IsMongoId } from 'class-validator';

export class AuthDto {
  @IsMongoId()
  authId: string;
}
