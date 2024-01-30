import { IsEnum } from 'class-validator';
import { UserStorage } from 'src/enums/storage.enum';

export class UserStorageDto {
  @IsEnum(UserStorage)
  type: UserStorage;
}
