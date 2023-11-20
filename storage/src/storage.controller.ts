import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserDetails, GetUser, AuthGuard } from '@dine_ease/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaxImageSizeValidator } from './validators/max-image.validator';
import { StorageService } from './storage.service';
import { UserStorageDto } from './dto/storage.dto';

@Controller('/api/storage')
@UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('user')
  @UseInterceptors(FileInterceptor('file'))
  uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    file: Express.Multer.File,
    @Body() userStorageDto: UserStorageDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.storageService.uploadUserImage(file, userStorageDto, user);
  }
}
