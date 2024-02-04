import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuItemDto } from './menu-item.dto';
import { Category } from 'src/enums/menu-categories.enum';

export class CreateMenuItemDto extends MenuItemDto {
  @IsEnum(Category)
  category: Category;

  @Type(() => Number)
  @IsNumber()
  order: number;
}
