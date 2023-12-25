// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigModule,
  JwtAuthModule,
  DatabaseModule,
  LoggerModule,
} from '@dine_ease/common';

// Services
import { S3Service } from './services/aws-s3.service';
import { UserService } from './user.service';

import { UserController } from './user.controller';
import { User, UserSchema } from './models/user.entity';

@Module({
  imports: [
    ConfigModule,
    JwtAuthModule,
    LoggerModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-users'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [S3Service, UserService],
  controllers: [UserController],
})
export class UserModule {}
