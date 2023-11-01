import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
