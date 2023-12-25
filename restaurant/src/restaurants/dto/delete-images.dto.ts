import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class DeleteImagesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images: string[];
}
