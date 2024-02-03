// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './mailer/mailer.module';
import { ConfigModule } from './config/config.module';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  JwtMailService,
} from '@dine_ease/common';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { User, UserSchema } from './models/user.entity';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    EmailModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [MailService, JwtMailService],
  controllers: [MailController],
})
export class MailModule {}
