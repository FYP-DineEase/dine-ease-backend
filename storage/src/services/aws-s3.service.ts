import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import {
  UploadData,
  DeleteOneData,
  DeleteManyData,
} from 'src/interfaces/storage.interface';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    // initializing s3 client
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

  // delete single file from cloud
  async deleteOne(deleteData: DeleteOneData): Promise<void> {
    const { bucketName, key } = deleteData;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  }

  // delete files from cloud
  async deleteMany(deleteData: DeleteManyData): Promise<void> {
    const { bucketName, images } = deleteData;

    await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: images.map((key: string) => ({ Key: key })),
        },
      }),
    );
  }

  // upload file to cloud
  async upload(uploadData: UploadData): Promise<string> {
    const { bucketName, file } = uploadData;
    const fileName = file.originalname;
    const body = file.buffer;

    // hash filename
    const iv = randomBytes(16);
    const dataToHash = fileName + iv.toString('hex');
    const key = createHash('sha256').update(dataToHash).digest('hex');

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentDisposition: `attachment; filename="${fileName}"`,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }
}
