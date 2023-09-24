// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, LoggerModule } from '@mujtaba-shafiq/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config-schema';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth, AuthSchema } from './models/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    NatsStreamingTransport.register({
      clientId: 'abc1',
      clusterId: 'dine-ease',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-auth'),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
