// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { LoggerModule, DatabaseModule } from '@mujtaba-web/common';
import { NatsModule } from './nats/nats.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    LoggerModule,
    JwtAuthModule,
    NatsModule,
    DatabaseModule.forRoot('mongodb://localhost/nest-auth'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
