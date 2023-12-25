import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Services
import { ReviewService } from 'src/review/review.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vote, VoteDocument } from './models/vote.entity';
import { ReviewDocument } from 'src/review/models/review.entity';

// DTO
import { ReviewIdDto, VoteIdDto } from './dto/mongo-id.dto';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name)
    private voteModel: Model<VoteDocument>,
    private readonly reviewService: ReviewService,
  ) {}

  // add vote nats event
  // update vote nats event

  // get user votes
  async getUserVotes(user: UserDetails): Promise<VoteDocument[]> {
    const votes: VoteDocument[] = await this.voteModel.find({
      userId: user.id,
    });
    return votes;
  }

  // add a vote
  async addVote(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    voteDto: VoteDto,
  ): Promise<string> {
    const { reviewId } = reviewIdDto;
    const { type } = voteDto;

    const review: ReviewDocument = await this.reviewService.getReviewById(
      reviewId,
    );

    const payload = { reviewId, userId: user.id, type };
    const vote: VoteDocument = await this.voteModel.create(payload);

    review.votes.push(vote.id);
    await review.save();

    return 'Vote created successfully';
  }

  // update a vote
  async updateVote(
    voteIdDto: VoteIdDto,
    voteDto: VoteDto,
    user: UserDetails,
  ): Promise<string> {
    const { type } = voteDto;
    const { voteId } = voteIdDto;

    const vote: VoteDocument = await this.voteModel.findById(voteId);
    if (!vote) throw new NotFoundException('Vote not found');

    if (vote.userId === user.id) {
      vote.set({ type });
      await vote.save();
      return 'Vote updated successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }

  // delete a vote
  async deleteVote(voteIdDto: VoteIdDto, user: UserDetails): Promise<string> {
    const { voteId } = voteIdDto;

    const vote: VoteDocument = await this.voteModel.findById(voteId);
    if (!vote) throw new NotFoundException('Vote not found');

    if (vote.userId === user.id) {
      await vote.deleteOne();

      const review: ReviewDocument = await this.reviewService.getReviewById(
        vote.reviewId,
      );

      const voteIndex = review.votes.findIndex(
        (v) => v.toString() === vote.id.toString(),
      );

      if (voteIndex === -1) {
        throw new NotFoundException('Vote not found in review');
      }

      review.votes.splice(voteIndex, 1);
      await review.save();

      return 'Vote deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
