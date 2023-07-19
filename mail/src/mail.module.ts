import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';
import { MailService } from './mail.service';
import { EmailModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    EmailModule,
    NatsModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
