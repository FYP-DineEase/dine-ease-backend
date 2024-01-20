import {
  IsMongoId,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class OrderItem {
  @IsMongoId()
  id: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class MenuOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orders: OrderItem[];
}
