// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAuthModule,
  LoggerModule,
  DatabaseModule,
} from '@mujtaba-web/common';

import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Storage, StorageSchema } from './schemas/storage.schema';
import { configValidationSchema } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-storage'),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  providers: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
