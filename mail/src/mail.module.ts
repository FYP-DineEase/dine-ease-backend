import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';
import { EmailModule } from './mailer/mailer.module';
import { LoggerModule } from '@mujtaba-web/common';

import { MailService } from './mail.service';
import { configValidationSchema } from './config-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    LoggerModule,
    NatsModule,
    EmailModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
