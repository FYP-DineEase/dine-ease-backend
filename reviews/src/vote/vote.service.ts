import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Logger
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vote, VoteDocument } from './models/vote.entity';

// DTO
import { VoteDto } from './dto/vote.dto';
import { VoteIdDto, ReviewIdDto } from './dto/mongo-id.dto';

@Injectable()
export class VoteService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Vote.name)
    private voteModel: Model<VoteDocument>,
  ) {}

  // get all votes of a review
  async getReviewVotes(reviewIdDto: ReviewIdDto): Promise<VoteDocument[]> {
    const { reviewId } = reviewIdDto;
    const votes: VoteDocument[] = await this.voteModel.find({ reviewId });
    return votes;
  }

  // get vote by Id
  async getVoteById(voteIdDto: VoteIdDto): Promise<VoteDocument> {
    const { voteId } = voteIdDto;
    const vote: VoteDocument = await this.voteModel.findById(voteId);
    return vote;
  }

  // add a vote
  async addVote(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    voteDto: VoteDto,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;
    const { type } = voteDto;

    // find review
    // if not found throw error

    const vote: VoteDocument = await this.voteModel.findById(reviewId);

    if (!vote) {
      const payload = { reviewId, userId: user.id, type };
      await this.voteModel.create(payload);
      return 'Vote created successfully';
    }
    vote.set({ type });
    return 'Vote updated successfully';
  }

  // delete a vote
  async deleteVote(voteIdDto: VoteIdDto, user: UserDetails): Promise<string> {
    const { voteId } = voteIdDto;

    const vote: VoteDocument = await this.voteModel.findById(voteId);
    if (!vote) throw new NotFoundException('Review not found');

    if (vote.userId === user.id) {
      await vote.deleteOne();
      return 'Vote deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
