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
import {
  AuthGuard,
  Roles,
  RolesGuard,
  AdminRoles,
  UserRoles,
} from '@dine_ease/common';

import { PlanService } from './plan.service';
import { PlanDocument } from './models/plan.entity';

// DTO
import { PlanIdDto } from './dto/mongo-id.dto';
import { PlanDto } from './dto/plan.dto';

@Controller('/api/plan')
@UseGuards(AuthGuard, RolesGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @Roles(AdminRoles.ADMIN)
  getAllPlans(): Promise<PlanDocument[]> {
    return this.planService.getPlans();
  }

  @Get('/active')
  @Roles(UserRoles.MANAGER)
  getPlans(): Promise<PlanDocument[]> {
    return this.planService.getActivePlans();
  }

  @Post()
  @Roles(AdminRoles.ADMIN)
  createPlan(@Body() planDto: PlanDto): Promise<PlanDocument> {
    return this.planService.createPlan(planDto);
  }

  @Patch('/:planId')
  @Roles(AdminRoles.ADMIN)
  updatePlan(
    @Param() planIdDto: PlanIdDto,
    @Body() planDto: PlanDto,
  ): Promise<string> {
    return this.planService.updatePlan(planIdDto, planDto);
  }

  @Delete('/:planId')
  @Roles(AdminRoles.ADMIN)
  deletePlan(@Param() planIdDto: PlanIdDto): Promise<string> {
    return this.planService.deletePlan(planIdDto);
  }
}
