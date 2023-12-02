import {
  IsMongoId,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from 'src/enums/menu-categories.enum';

class OrderItem {
  @IsMongoId()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class MenuOrderDto {
  @IsEnum(Category)
  category: Category;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orders: OrderItem[];
}
