import { ArrayMinSize, ArrayUnique, IsArray, IsEmail } from 'class-validator';

export class EmailsDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  emails: string[];
}
