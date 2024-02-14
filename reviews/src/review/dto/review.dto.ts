import {
  Min,
  Max,
  IsArray,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Rating must not be less than 1' })
  @Max(5, { message: 'Rating must not be greater than 5' })
  rating: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  deletedImages: string[];
}
