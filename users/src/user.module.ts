// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
  JwtMailService,
} from '@dine_ease/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './models/user.entity';

@Module({
  imports: [
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-users'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, JwtMailService],
  controllers: [UserController],
})
export class UserModule {}
