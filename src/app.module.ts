// Modules
import { Module } from '@nestjs/common';
import { DatabaseModule } from './startup/database.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './utils/logger.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
