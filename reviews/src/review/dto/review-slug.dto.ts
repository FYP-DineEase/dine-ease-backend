import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ReviewSlugDto {
  @IsString()
  @Length(10, 10)
  @IsNotEmpty()
  slug: string;
}
