import { IsString, Length, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class MenuItemDto {
  @IsString()
  @Length(3, 15)
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Price must be at least 1' })
  @Max(10000, { message: 'Price cannot exceed 10000' })
  price: number;

  @IsString()
  @Length(3, 100)
  description: string;
}
