import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from 'src/review/review.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Vote, VoteSchema } from './models/vote.entity';

@Module({
  imports: [
    ReviewModule,
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
  ],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
