import { Module } from '@nestjs/common';
import { NatsWrapper } from './nats.wrapper';
import { NatsService } from './nats.service';
import { MailService } from 'src/mail.service';

@Module({
  providers: [NatsWrapper, NatsService, MailService],
  exports: [NatsWrapper],
})
export class NatsModule {}
