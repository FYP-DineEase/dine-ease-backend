import { IsMongoId } from 'class-validator';

export class VoteIdDto {
  @IsMongoId()
  voteId: string;
}

export class ReviewIdDto {
  @IsMongoId()
  reviewId: string;
}
