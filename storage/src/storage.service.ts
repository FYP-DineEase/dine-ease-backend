import { Injectable } from '@nestjs/common';
import { UserDetails, UserStorage } from '@dine_ease/common';

// Services
import { S3Service } from './services/aws-s3.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user-storage.entity';
import { Review, ReviewDocument } from './models/review-storage.entity';
import {
  Restaurant,
  RestaurantDocument,
} from './models/restaurant-storage.entity';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { UserStorageUploadedEvent, Subjects } from '@dine_ease/common';

import { UploadData, DeleteOneData } from './interfaces/storage.interface';
import { UserStorageDto } from './dto/storage.dto';

@Injectable()
export class StorageService {
  constructor(
    private readonly publisher: Publisher,
    private readonly s3Service: S3Service,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // user
  async uploadUserImage(
    file: Express.Multer.File,
    userStorageDto: UserStorageDto,
    user: UserDetails,
  ): Promise<string> {
    const { id: userId } = user;
    const { type } = userStorageDto;
    const bucketName = `dine-ease-${type}`;

    const found: UserDocument = await this.userModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, type } },
      { new: true, upsert: true },
    );

    const foundImage = type === UserStorage.AVATAR ? found.avatar : found.cover;

    if (foundImage) {
      const payload: DeleteOneData = { bucketName, key: foundImage };
      await this.s3Service.deleteOne(payload);
    }

    const uploadData: UploadData = { bucketName, file };
    const result = await this.s3Service.upload(uploadData);

    found.set({ [type === UserStorage.AVATAR ? 'avatar' : 'cover']: result });
    await found.save();

    const event: UserStorageUploadedEvent = {
      userId,
      type,
      image: result,
      version: found.version,
    };

    // publishing event
    this.publisher.emit<string, UserStorageUploadedEvent>(
      Subjects.StorageUserUploaded,
      event,
    );

    return 'Image Uploaded Successfully';
  }
}
