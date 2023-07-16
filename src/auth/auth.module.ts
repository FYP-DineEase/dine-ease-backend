// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../utils/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    JwtAuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
