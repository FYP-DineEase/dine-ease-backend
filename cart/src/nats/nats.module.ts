import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';
import { NatsWrapper } from '@mujtaba-web/common';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  imports: [PlaylistModule],
  providers: [NatsWrapper, NatsService],
  exports: [NatsWrapper],
})
export class NatsModule {}
