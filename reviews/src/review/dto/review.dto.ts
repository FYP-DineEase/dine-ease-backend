import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Rating must not be less than 1' })
  @Max(5, { message: 'Rating must not be greater than 5' })
  rating: number;
}
