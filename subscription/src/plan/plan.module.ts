// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan, PlanSchema } from './models/plan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
  ],
  providers: [PlanService],
  controllers: [PlanController],
  exports: [PlanService],
})
export class PlanModule {}
