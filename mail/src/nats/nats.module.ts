import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { NatsWrapper } from '@mujtaba-web/common';
import { EmailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [EmailModule],
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
