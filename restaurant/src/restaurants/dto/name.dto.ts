import { Length, IsAlphanumeric } from 'class-validator';
import { IsNotBlank } from '../decorators/not-blank.decorator';

export class RestaurantNameDto {
  @IsNotBlank()
  @IsAlphanumeric()
  @Length(3, 30, { message: 'name must be between 3 and 30 characters' })
  name: string;
}
