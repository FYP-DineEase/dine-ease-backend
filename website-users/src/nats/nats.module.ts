import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { NatsWrapper } from '@mujtaba-web/common';
import { WebsiteModule } from 'src/website/website.module';

@Module({
  imports: [WebsiteModule],
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
