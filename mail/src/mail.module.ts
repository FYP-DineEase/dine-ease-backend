// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  JwtMailService,
} from '@dine_ease/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './mailer/mailer.module';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { User, UserSchema } from './models/user.entity';
import { configValidationSchema } from './config/config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    JwtAuthModule,
    LoggerModule,
    EmailModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-mail'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [MailService, JwtMailService],
  controllers: [MailController],
})
export class MailModule {}
