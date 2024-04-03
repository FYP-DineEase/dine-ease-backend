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
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './models/plan.entity';
import { UserDocument } from 'src/user/models/user.entity';

// DTO
import { PlanDto } from './dto/plan.dto';
import { PlanSlugDto } from './dto/plan-slug.dto';
import { UserIdDto, PlanIdDto } from './dto/mongo-id.dto';

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
  async allUserPlans(userIdDto: UserIdDto): Promise<PlanDocument[]> {
    const { userId } = userIdDto;
    const found: PlanDocument[] = await this.planModel.find({ userId });
    return found;
  }

  // find plan by slug
  async findPlanBySlug(mapSlugDto: PlanSlugDto): Promise<PlanDocument> {
    const { slug } = mapSlugDto;
    const found: PlanDocument = await this.planModel
      .findOne({ slug })
      .populate([
        {
          path: 'userId',
          model: 'User',
        },
        {
          path: 'restaurant',
          model: 'Restaurant',
          match: { isDeleted: { $ne: true } },
        },
      ]);
    if (!found) throw new NotFoundException('Dining Plan not found');
    return found;
  }

  // create a dining plan
  async createPlan(planDto: PlanDto, user: UserDetails): Promise<PlanDocument> {
    const { title, description, date, invitees, restaurant } = planDto;

    await this.restaurantService.findRestaurantById(restaurant);

    const plan: PlanDocument = await this.planModel.create({
      userId: user.id,
      title,
      slug: nanoid(10),
      description,
      date,
      invitees,
      restaurant,
    });

    await plan.populate({
      path: 'userId',
      model: 'User',
    });

    let name: string;

    if (plan.userId instanceof Types.ObjectId) {
      console.error('userId is not populated');
    } else {
      name = (plan.userId as UserDocument).name;
    }

    const event: InvitedEvent = {
      name,
      title,
      description,
      date,
      slug: plan.slug,
      invitees,
    };

    this.publisher.emit<void, InvitedEvent>(Subjects.InvitedEvent, event);

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
      const { title, description, date, invitees, restaurant } = planDto;

      // New invitees
      const newInvitees = invitees.filter(
        (invitee) => !found.invitees.includes(invitee),
      );

      await this.restaurantService.findRestaurantById(restaurant);

      found.set({ title, description, date, invitees, restaurant });
      await found.save();

      await found.populate({
        path: 'userId',
        model: 'User',
      });

      let name: string;

      if (found.userId instanceof Types.ObjectId) {
        console.error('userId is not populated');
      } else {
        name = (found.userId as UserDocument).name;
      }

      // Send email to new invitees
      if (newInvitees.length > 0) {
        const event: InvitedEvent = {
          name,
          title,
          description,
          date,
          slug: found.slug,
          invitees: newInvitees,
        };

        this.publisher.emit<void, InvitedEvent>(Subjects.InvitedEvent, event);
      }

      return 'Dining Plan updated successfully';
    }

    throw new UnauthorizedException('User is not authorized');
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
