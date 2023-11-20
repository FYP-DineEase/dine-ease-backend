// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config-schema';

import { S3Service } from './services/aws-s3.service';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

import { User, UserSchema } from './models/user-storage.entity';
import { Review, ReviewSchema } from './models/review-storage.entity';
import {
  Restaurant,
  RestaurantSchema,
} from './models/restaurant-storage.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: 'abc4',
      clusterId: 'dine-ease',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-storage'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [S3Service, StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
