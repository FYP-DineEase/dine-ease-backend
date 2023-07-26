import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { MailService } from 'src/mail.service';
import { NatsWrapper } from '@mujtaba-web/common';

@Module({
  providers: [NatsWrapper, NatsService, MailService],
  exports: [NatsWrapper],
})
export class NatsModule {}
