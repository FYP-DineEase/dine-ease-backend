import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RecommendationDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1000)
  distanceInMeters: number;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  coordinates: number[];
}
