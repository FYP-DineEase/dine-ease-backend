import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserDetails,
  NotificationType,
  NotificationCategory,
} from '@dine_ease/common';

// Services
import { ReviewService } from 'src/review/review.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Vote, VoteDocument } from './models/vote.entity';
import { ReviewDocument } from 'src/review/models/review.entity';

// NATS
import {
  Subjects,
  NotificationCreatedEvent,
  NotificationUpdatedEvent,
  NotificationDeletedEvent,
} from '@dine_ease/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// DTO
import { ReviewIdDto, UserIdDto, VoteIdDto } from './dto/mongo-id.dto';
import { VoteDto } from './dto/vote.dto';

// Enums
import { VoteStrings } from 'src/enums/votes.enum';

@Injectable()
export class VoteService {
  constructor(
    private readonly publisher: Publisher,
    private readonly reviewService: ReviewService,
    @InjectModel(Vote.name)
    private voteModel: Model<VoteDocument>,
  ) {}

  // get user votes
  async getUserVotes(userIdDto: UserIdDto): Promise<VoteDocument[]> {
    const { userId } = userIdDto;
    const votes: VoteDocument[] = await this.voteModel
      .find({
        userId,
      })
      .populate([
        {
          path: 'reviewId',
          model: 'Review',
          populate: [
            {
              path: 'restaurantId',
              model: 'Restaurant',
            },
            {
              path: 'userId',
              model: 'User',
            },
          ],
        },
      ]);
    return votes;
  }

  // add a vote
  async addVote(
    reviewIdDto: ReviewIdDto,
    user: UserDetails,
    voteDto: VoteDto,
  ): Promise<VoteDocument> {
    const { reviewId } = reviewIdDto;
    const { type } = voteDto;

    const review: ReviewDocument = await this.reviewService.getReviewById(
      reviewId,
    );

    const payload = { reviewId, userId: user.id, type };
    const vote: VoteDocument = await this.voteModel.create(payload);

    review.votes.push(vote.id);
    await review.save();

    const notificationEvent: NotificationCreatedEvent = {
      uid: vote.id,
      senderId: user.id,
      receiverId: review.userId,
      category: NotificationCategory.User,
      type: NotificationType.Vote,
      slug: review.slug,
      message: VoteStrings[type.toUpperCase()],
    };

    this.publisher.emit<void, NotificationCreatedEvent>(
      Subjects.NotificationCreated,
      notificationEvent,
    );

    return vote;
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

      const notificationEvent: NotificationUpdatedEvent = {
        uid: vote.id,
        message: VoteStrings[type.toUpperCase()],
        updatedAt: new Date(Date.now()),
      };

      this.publisher.emit<void, NotificationUpdatedEvent>(
        Subjects.NotificationUpdated,
        notificationEvent,
      );

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

      const notificationEvent: NotificationDeletedEvent = {
        uid: vote.id,
      };

      this.publisher.emit<void, NotificationDeletedEvent>(
        Subjects.NotificationDeleted,
        notificationEvent,
      );

      return 'Vote deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
