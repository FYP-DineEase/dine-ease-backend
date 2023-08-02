import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { NatsWrapper } from '@mujtaba-web/common';

@Module({
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
