import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDetails } from '@dine_ease/common';
import { StorageTypes } from './utils/enums/storage-type.enum';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Storage, StorageDocument } from './models/storage.entity';

// Logger
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AvatarUploadedEvent, Subjects } from '@dine_ease/common';

@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private readonly configService: ConfigService,
    private readonly publisher: Publisher,
  ) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.get<string>('AWS_S3_REGION'),
    });
  }

  // upload user image
  async uploadUserImage(
    file: Express.Multer.File,
    user: UserDetails,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const key = `${file.originalname}-${Date.now()}`;
    const body = file.buffer;

    try {
      // storing image in S3
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: body,
          ContentType: file.mimetype,
        }),
      );

      // generating url
      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

      // storing the document
      await this.storageModel.create({
        userId: user.id,
        image: imageUrl,
        type: StorageTypes.AVATAR,
      });

      const event: AvatarUploadedEvent = {
        userId: user.id,
        avatar: imageUrl,
      };

      // publishing event
      this.publisher.emit<string, AvatarUploadedEvent>(
        Subjects.StorageAvatarUploaded,
        event,
      );

      return 'Avatar Uploaded Successfully';
    } catch (error) {
      this.logger.error('Error uploading image:', error);
      throw error;
    }
  }
}
