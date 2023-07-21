import { Module } from '@nestjs/common';
import { NatsLoggerModule } from '@mujtaba-web/common';
import { NatsWrapper } from './nats.wrapper';
import { NatsService } from './nats.service';
import { MailService } from 'src/mail.service';

@Module({
  imports: [NatsLoggerModule],
  providers: [NatsWrapper, NatsService, MailService],
  exports: [NatsWrapper],
})
export class NatsModule {}
