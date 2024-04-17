import { ConflictException, Injectable } from '@nestjs/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './models/plan.entity';

// DTO
import { PlanIdDto } from './dto/mongo-id.dto';
import { PlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
  ) {}

  // all plans
  async getPlans(): Promise<PlanDocument[]> {
    const plans: PlanDocument[] = await this.planModel.find();
    return plans;
  }

  // active plans
  async getActivePlans(): Promise<PlanDocument[]> {
    const plans: PlanDocument[] = await this.planModel.find({ isActive: true });
    return plans;
  }

  // find plan
  async findPlan(planId: Types.ObjectId): Promise<PlanDocument> {
    const found: PlanDocument = await this.planModel.findById(planId);
    if (!found) throw new ConflictException('Plan not found');
    return found;
  }

  // create a payment plan
  async createPlan(planDto: PlanDto): Promise<PlanDocument> {
    const { title, description, charges, durationInMonths } = planDto;
    const plan: PlanDocument = await this.planModel.create({
      title,
      description,
      charges,
      durationInMonths,
    });
    return plan;
  }

  // update a payment plan
  async updatePlan(
    planIdDto: PlanIdDto,
    planDto: PlanDto,
  ): Promise<PlanDocument> {
    const { title, description, charges, durationInMonths } = planDto;
    const plan: PlanDocument = await this.findPlan(planIdDto.planId);
    plan.set({ title, description, charges, durationInMonths });
    await plan.save();
    return plan;
  }

  // delete a payment plan
  async deletePlan(planIdDto: PlanIdDto): Promise<string> {
    const plan: PlanDocument = await this.findPlan(planIdDto.planId);
    plan.set({ isActive: false });
    await plan.save();
    return 'Payment plan deleted successfully';
  }
}
