import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// Restaurant
import { VoteService } from './vote.service';
import { VoteDocument } from './models/vote.entity';

// DTO
import { VoteDto } from './dto/vote.dto';
import { VoteIdDto, ReviewIdDto } from './dto/mongo-id.dto';

@Controller('/api/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('/review/:reviewId')
  getReviewVotes(@Param() id: ReviewIdDto): Promise<VoteDocument[]> {
    return this.voteService.getReviewVotes(id);
  }

  @Get('/:voteId')
  getReviewById(@Param() id: VoteIdDto): Promise<VoteDocument> {
    return this.voteService.getVoteById(id);
  }

  @Post('/:reviewId')
  @UseGuards(AuthGuard)
  addVote(
    @Param() id: ReviewIdDto,
    @GetUser() user: UserDetails,
    @Body() data: VoteDto,
  ): Promise<string> {
    return this.voteService.addVote(id, user, data);
  }

  @Delete('/:voteId')
  @UseGuards(AuthGuard)
  deleteRestaurant(
    @Param() id: VoteIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.voteService.deleteVote(id, user);
  }
}
