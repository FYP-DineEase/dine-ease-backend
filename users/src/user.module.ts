// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { JwtAuthModule, DatabaseModule, LoggerModule } from '@dine_ease/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Services
import { S3Service } from './services/aws-s3.service';
import { UserService } from './user.service';

import { UserController } from './user.controller';
import { User, UserSchema } from './models/user.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [S3Service, UserService],
  controllers: [UserController],
})
export class UserModule {}
