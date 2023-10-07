import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

// Misc
import { UserDetails, GetUser, AuthGuard } from '@dine_ease/common';
import { MaxImageFileSizeValidator } from './validators/max-image.validator';

@Controller('/api/storage')
// @UseGuards(AuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('user-avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageFileSizeValidator(),
    )
    file: Express.Multer.File,
    // @GetUser() user: UserDetails,
  ): Promise<string> {
    // return this.storageService.uploadUserImage(file, user);
    return this.storageService.uploadUserImage(file);
  }
}
