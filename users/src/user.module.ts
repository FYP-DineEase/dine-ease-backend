// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, LoggerModule } from '@dine_ease/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config-schema';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TwilioService } from './services/twilio.service';
import { User, UserSchema } from './models/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-users'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, TwilioService],
  controllers: [UserController],
})
export class UserModule {}
