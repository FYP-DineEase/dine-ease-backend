import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ContentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;
}
