import { UserEmailDto } from './user-email.dto';
import { UserPasswordDto } from './user-password.dto';

export class UserCredentialsDto {
  email: UserEmailDto;
  password: UserPasswordDto;
}
