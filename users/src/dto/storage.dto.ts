import { IsEnum } from 'class-validator';
import { UserStorage } from '@dine_ease/common';

export class UserStorageDto {
  @IsEnum(UserStorage)
  type: UserStorage;
}
