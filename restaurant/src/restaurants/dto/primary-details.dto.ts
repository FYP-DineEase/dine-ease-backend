import { IsNumberString, Length } from 'class-validator';
import { RestaurantNameDto } from './name.dto';

export class PrimaryDetailsDto extends RestaurantNameDto {
  @IsNumberString({}, { message: 'taxId must be a number' })
  @Length(13, 13, { message: 'taxId must be 13 digits' })
  taxId: string;
}
