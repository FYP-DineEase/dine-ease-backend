import { ArrayMinSize, ArrayUnique, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ReadDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  ids: Types.ObjectId[];
}
