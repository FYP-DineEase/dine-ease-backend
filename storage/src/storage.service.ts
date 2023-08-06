import { Injectable } from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Storage, StorageDocument } from './schemas/storage.schema';

// utils
import { UserDetails } from '@mujtaba-web/common';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
  ) {}

  // upload user image
  async uploadUserImage(
    file: Express.Multer.File,
    user: UserDetails,
  ): Promise<string> {
    console.log(file);
    console.log(user.id);
    return 'Image Uploaded Successfully';
  }
}
