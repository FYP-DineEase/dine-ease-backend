// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoggerModule,
  DatabaseModule,
  JwtAuthModule,
} from '@mujtaba-web/common';
import { NatsModule } from './nats/nats.module';

import { AuthService } from './auth.service';
import { JwtMailService } from './jwt/jwt-mail.service';

import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { configValidationSchema } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    JwtAuthModule,
    LoggerModule,
    NatsModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-auth'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, JwtMailService],
  controllers: [AuthController],
})
export class AuthModule {}
