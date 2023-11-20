import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MaxImageSizeValidator implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    const oneKb = 1000;
    const oneMb = oneKb * oneKb;
    const maxSize = oneMb + 1;
    const check = file.size < maxSize;

    if (!check) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of (1 mb).`,
      );
    }
    return file;
  }
}
