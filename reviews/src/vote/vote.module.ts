import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from 'src/review/review.module';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';

import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Vote, VoteSchema } from './models/vote.entity';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: process.env.NATS_CLIENT_ID,
      clusterId: process.env.NATS_CLUSTER_ID,
      connectOptions: {
        url: process.env.NATS_URL,
      },
    }),
    ReviewModule,
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
  ],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
