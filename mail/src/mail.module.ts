import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';
import { EmailModule } from './mailer/mailer.module';
import { LoggerModule } from '@mujtaba-web/common';

import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    LoggerModule,
    EmailModule,
    NatsModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
