// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { NatsModule } from './nats/nats.module';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { configValidationSchema } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    LoggerModule,
    JwtAuthModule,
    NatsModule,
    DatabaseModule.forRoot('mongodb://127.0.0.1:27017/nest-auth'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
