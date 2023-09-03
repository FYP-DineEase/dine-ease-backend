import { Module } from '@nestjs/common';
import { NatsWrapper } from '@mujtaba-web/common';
import { NatsService } from './nats.service';

@Module({
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
