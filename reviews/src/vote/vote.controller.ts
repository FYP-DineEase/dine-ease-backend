import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// Restaurant
import { VoteService } from './vote.service';
import { VoteDocument } from './models/vote.entity';

// DTO
import { ReviewIdDto, VoteIdDto } from './dto/mongo-id.dto';
import { VoteDto } from './dto/vote.dto';

@Controller('/api/review/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('/user')
  @UseGuards(AuthGuard)
  async getUserVotes(@GetUser() user: UserDetails): Promise<VoteDocument[]> {
    return this.voteService.getUserVotes(user);
  }

  @Post('/:reviewId')
  @UseGuards(AuthGuard)
  async addVote(
    @Param() reviewIdDto: ReviewIdDto,
    @Body() voteDto: VoteDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.voteService.addVote(reviewIdDto, user, voteDto);
  }

  @Patch('/:voteId')
  @UseGuards(AuthGuard)
  async updateVote(
    @Param() voteIdDto: VoteIdDto,
    @Body() voteDto: VoteDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.voteService.updateVote(voteIdDto, voteDto, user);
  }

  @Delete('/:voteId')
  @UseGuards(AuthGuard)
  async deleteRestaurant(
    @Param() voteIdDto: VoteIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.voteService.deleteVote(voteIdDto, user);
  }
}
