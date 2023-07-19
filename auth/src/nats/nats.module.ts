import { Module } from '@nestjs/common';
import { NatsWrapper } from './nats.wrapper';
import { NatsService } from './nats.service';

@Module({
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
