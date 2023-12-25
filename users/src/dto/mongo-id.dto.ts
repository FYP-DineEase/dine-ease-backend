import { IsArray, ArrayMinSize, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UserIdDto {
  @IsMongoId()
  userId: Types.ObjectId;
}

export class UsersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  users: Types.ObjectId[];
}
