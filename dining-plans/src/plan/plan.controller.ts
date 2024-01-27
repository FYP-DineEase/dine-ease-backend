import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// Restaurant
import { PlanService } from './plan.service';
import { PlanDocument } from './models/plan.entity';

// DTO
import { PlanDto } from './dto/plan.dto';
import { RestaurantIdDto, VoteIdDto, PlanIdDto } from './dto/mongo-id.dto';
import { PlanSlugDto } from './dto/plan-slug.dto';

@Controller('/api/dining-plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @UseGuards(AuthGuard)
  async allUserPlans(@GetUser() user: UserDetails): Promise<PlanDocument[]> {
    return this.planService.allUserPlans(user);
  }

  @Get('/:slug')
  async findPlanBySlug(@Param() slug: PlanSlugDto): Promise<PlanDocument> {
    return this.planService.findPlanBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPlan(
    @GetUser() user: UserDetails,
    @Body() planDto: PlanDto,
  ): Promise<PlanDocument> {
    return this.planService.createPlan(planDto, user);
  }

  @Post('/vote/:planId')
  @UseGuards(AuthGuard)
  async addVote(
    @Param() planIdDto: PlanIdDto,
    @Body() restaurantIdDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.planService.addVote(planIdDto, restaurantIdDto, user);
  }

  @Patch('/:planId')
  @UseGuards(AuthGuard)
  async updatePlan(
    @Param() planIdDto: PlanIdDto,
    @Body() planDto: PlanDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.planService.updatePlan(planIdDto, planDto, user);
  }

  @Delete('/:planId/:voteId')
  @UseGuards(AuthGuard)
  async deleteVote(
    @Param() voteIdDto: VoteIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.planService.deleteVote(voteIdDto, user);
  }

  @Delete('/:planId')
  @UseGuards(AuthGuard)
  async deletePlan(
    @Param() planIdDto: PlanIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.planService.deletePlan(planIdDto, user);
  }
}
