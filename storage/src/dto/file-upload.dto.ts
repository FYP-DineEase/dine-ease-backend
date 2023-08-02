import { IsOptional, IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @IsNotEmpty()
  file?: Express.Multer.File;
}
