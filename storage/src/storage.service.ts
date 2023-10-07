import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDetails } from '@dine_ease/common';
import { S3 } from '@aws-sdk';

// Nats
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AccountCreatedEvent, Subjects } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Storage, StorageDocument } from './models/storage.entity';

@Injectable()
export class StorageService {
  private readonly s3Client = new S3({
    access: this.configService.get<string>('AWS_S3_REGION'),
  });

  // private publisher: Publisher,

  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private readonly configService: ConfigService,
  ) {}

  // upload user image
  async uploadUserImage(
    file: Express.Multer.File,
    // user: UserDetails,
  ): Promise<string> {
    console.log(file);
    // console.log(user.id);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'dine-ease',
        Key: file.originalname,
        Body: file.buffer,
      }),
    );

    return 'Image Uploaded Successfully';
  }
}
