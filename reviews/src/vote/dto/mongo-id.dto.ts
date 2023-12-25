import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class VoteIdDto {
  @IsMongoId()
  voteId: Types.ObjectId;
}

export class ReviewIdDto {
  @IsMongoId()
  reviewId: Types.ObjectId;
}
