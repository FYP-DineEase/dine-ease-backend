import { IsNotEmpty, IsArray, ArrayMinSize, IsMongoId } from 'class-validator';

export class MapDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  @IsNotEmpty({ each: true })
  restaurants: string[];
}
