import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly bucketName: string;

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

    this.bucketName = this.configService.get<string>('AWS_S3_USERS_BUCKET');
  }

  // delete single file from cloud
  async deleteOne(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  // upload file to cloud
  async upload(path: string, file: Express.Multer.File): Promise<string> {
    const fileName = file.originalname;
    const body = file.buffer;

    // hash filename
    const iv = randomBytes(16);
    const dataToHash = fileName + iv.toString('hex');
    const key = createHash('sha256').update(dataToHash).digest('hex');

    const pathKey = `${path}/${key}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: pathKey,
        Body: body,
        ContentDisposition: `attachment; filename="${fileName}"`,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }
}
