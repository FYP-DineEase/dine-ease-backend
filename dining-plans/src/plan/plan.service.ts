import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';
import { nanoid } from 'nanoid';

// Services
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { InvitedEvent, Subjects } from '@dine_ease/common';

// Nats
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './models/plan.entity';

// DTO
import { PlanDto } from './dto/plan.dto';
import { PlanSlugDto } from './dto/plan-slug.dto';
import { RestaurantIdDto, VoteIdDto, PlanIdDto } from './dto/mongo-id.dto';

@Injectable()
export class PlanService {
  constructor(
    private readonly publisher: Publisher,
    private readonly restaurantService: RestaurantService,
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
  ) {}

  // find plan by id
  async findPlanById(planIdDto: PlanIdDto): Promise<PlanDocument> {
    const { planId } = planIdDto;
    const found: PlanDocument = await this.planModel.findById(planId);
    if (!found) throw new NotFoundException('Dining Plan not found');
    return found;
  }

  // find user plans
  async allUserPlans(user: UserDetails): Promise<PlanDocument[]> {
    const userId = user.id;
    const found: PlanDocument[] = await this.planModel.find({ userId });
    return found;
  }

  // find plan by slug
  async findPlanBySlug(mapSlugDto: PlanSlugDto): Promise<PlanDocument> {
    const { slug } = mapSlugDto;
    const found: PlanDocument = await this.planModel
      .findOne({ slug })
      .populate({
        path: 'restaurants',
        model: 'Restaurant',
        match: { isDeleted: { $ne: true } },
      })
      .exec();
    if (!found) throw new NotFoundException('Dining Plan not found');
    return found;
  }

  // add vote to a plan
  async addVote(
    planIdDto: PlanIdDto,
    restaurantIdDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const userId = user.id;
    const { restaurantId } = restaurantIdDto;

    const found: PlanDocument = await this.findPlanById(planIdDto);
    found.votes.push({ userId, restaurantId });
    await found.save();

    return 'Vote added successfully';
  }

  // create a dining plan
  async createPlan(planDto: PlanDto, user: UserDetails): Promise<PlanDocument> {
    const { title, description, date, invitees, restaurants } = planDto;

    await this.restaurantService.validateRestaurantIds(restaurants);

    const plan: PlanDocument = await this.planModel.create({
      userId: user.id,
      title,
      slug: nanoid(10),
      description,
      date,
      invitees,
      restaurants,
    });

    plan.populate({ path: 'userId' });
    console.log(plan);
    // const event: InvitedEvent = {
    //   name,
    //   title,
    //   description,
    //   date,
    //   slug: plan.slug,
    //   invitees,
    // };

    // this.publisher.emit<void, InvitedEvent>(Subjects.InvitedEvent, event);

    return plan;
  }

  // update dining plan
  async updatePlan(
    planIdDto: PlanIdDto,
    planDto: PlanDto,
    user: UserDetails,
  ): Promise<string> {
    const found: PlanDocument = await this.findPlanById(planIdDto);

    if (found.userId === user.id) {
      const { title, description, date, invitees, restaurants } = planDto;

      // New invitees
      const newInvitees = invitees.filter(
        (invitee) => !found.invitees.includes(invitee),
      );

      await this.restaurantService.validateRestaurantIds(restaurants);

      found.set({ title, description, date, invitees, restaurants });
      await found.save();

      // Send email to new invitees
      if (newInvitees.length > 0) {
        // send email notification to users about the plan
      }

      return 'Dining Plan updated successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }

  // delete vote
  async deleteVote(voteIdDto: VoteIdDto, user: UserDetails): Promise<string> {
    const userId = user.id;
    const { planId, voteId } = voteIdDto;

    const found: PlanDocument = await this.planModel.findByIdAndUpdate(
      planId,
      {
        $pull: { votes: { userId, _id: voteId } },
      },
      { new: true },
    );

    if (!found) throw new NotFoundException('Vote not found');
    return 'Vote deleted successfully';
  }

  // delete plan
  async deletePlan(planIdDto: PlanIdDto, user: UserDetails): Promise<string> {
    const found: PlanDocument = await this.findPlanById(planIdDto);

    if (found.userId === user.id) {
      await found.deleteOne();
      return 'Dining Plan deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
