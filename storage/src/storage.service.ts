import { Injectable } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Nats
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AccountCreatedEvent, Subjects } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Storage, StorageDocument } from './models/storage.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private publisher: Publisher,
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
