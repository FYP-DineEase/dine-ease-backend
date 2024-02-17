import { Length, IsNumberString } from 'class-validator';
import { IsNotBlank } from '../decorators/not-blank.decorator';

export class PrimaryDetailsDto {
  @IsNotBlank()
  // @Length(3, 30, { message: 'name must be between 3 and 30 characters' })
  name: string;

  @IsNumberString({}, { message: 'taxId must be a number' })
  @Length(13, 13, { message: 'taxId must be 13 digits' })
  taxId: string;
}
