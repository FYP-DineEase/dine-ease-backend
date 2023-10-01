// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, LoggerModule, JwtMailService } from '@dine_ease/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './mailer/mailer.module';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';
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
  ],
  providers: [MailService, JwtMailService],
  controllers: [MailController],
})
export class MailModule {}
