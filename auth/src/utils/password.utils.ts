import * as bcrypt from 'bcryptjs';
import { UserPasswordDto } from 'src/dto/user-password.dto';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async (
  password: UserPasswordDto,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
