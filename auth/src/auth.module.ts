// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  JwtMailService,
} from '@dine_ease/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth, AuthSchema } from './models/auth.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: 'abc1',
      clusterId: 'dine-ease',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-auth'),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  providers: [AuthService, JwtMailService],
  controllers: [AuthController],
})
export class AuthModule {}
