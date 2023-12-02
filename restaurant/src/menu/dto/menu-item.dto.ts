import { IsString, Length, IsNumber, Max, IsEnum } from 'class-validator';
import { Category } from 'src/enums/menu-categories.enum';

export class MenuItemDto {
  @IsString()
  @Length(3, 15)
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Max(10000)
  price: number;

  @IsString()
  @Length(3, 100)
  description: string;

  @IsEnum(Category)
  category: Category;
}
