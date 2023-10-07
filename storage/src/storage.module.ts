// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Storage, StorageSchema } from './models/storage.entity';

@Module({
  imports: [
    // NatsStreamingTransport.register({
    //   clientId: 'abc4',
    //   clusterId: 'dine-ease',
    //   connectOptions: {
    //     url: 'http://localhost:4222',
    //   },
    // }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-storage'),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  providers: [StorageService],
  controllers: [StorageController],
})
export class ServiceModule {}
