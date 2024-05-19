import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  NotificationCategory,
  NotificationType,
  UserDetails,
} from '@dine_ease/common';
import { nanoid } from 'nanoid';

// Services
import { UserService } from 'src/user/user.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';

// Nats
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  NotificationCreatedEvent,
  NotificationDeletedEvent,
  InvitedEvent,
  Subjects,
} from '@dine_ease/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './models/plan.entity';
import { UserDocument } from 'src/user/models/user.entity';

// DTO
import { UserDto } from './dto/user.dto';
import { PlanDto } from './dto/plan.dto';
import { PlanSlugDto } from './dto/plan-slug.dto';
import { UserIdDto, PlanIdDto } from './dto/mongo-id.dto';

@Injectable()
export class PlanService {
  constructor(
    private readonly publisher: Publisher,
    private readonly userService: UserService,
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
    const found: PlanDocument[] = await this.planModel
      .find({ userId })
      .populate([
        {
          path: 'restaurant',
          model: 'Restaurant',
        },
      ]);
    return found;
  }

  // find plans in which user is invited
  async invitedUserPlans(userDto: UserDto): Promise<PlanDocument[]> {
    const { email } = userDto;
    const found: PlanDocument[] = await this.planModel
      .find({ invitees: { $in: [email] } })
      .populate([
        {
          path: 'restaurant',
          model: 'Restaurant',
        },
      ]);
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

    const inviteesIds = await this.userService.findIds({ emails: invitees });

    const event: InvitedEvent = {
      name,
      title,
      description,
      date,
      slug: plan.slug,
      invitees,
    };

    this.publisher.emit<void, InvitedEvent>(Subjects.InvitedEvent, event);

    if (inviteesIds.length > 0) {
      const notificationEvent: NotificationCreatedEvent = {
        uid: plan.id,
        senderId: user.id,
        receiverId: inviteesIds,
        category: NotificationCategory.User,
        type: NotificationType.Dining,
        slug: plan.slug,
        message: `has invited you to dine out`,
      };

      this.publisher.emit<void, NotificationCreatedEvent>(
        Subjects.NotificationCreated,
        notificationEvent,
      );
    }

    return plan;
  }

  // update dining plan
  async updatePlan(
    planIdDto: PlanIdDto,
    planDto: PlanDto,
    user: UserDetails,
  ): Promise<PlanDocument> {
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

      await found.populate([
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

      let name: string;

      if (found.userId instanceof Types.ObjectId) {
        console.error('userId is not populated');
      } else {
        name = (found.userId as UserDocument).name;
      }

      // Send email to new invitees
      if (newInvitees.length > 0) {
        const inviteesIds = await this.userService.findIds({
          emails: newInvitees,
        });

        const event: InvitedEvent = {
          name,
          title,
          description,
          date,
          slug: found.slug,
          invitees: newInvitees,
        };

        this.publisher.emit<void, InvitedEvent>(Subjects.InvitedEvent, event);

        if (inviteesIds.length > 0) {
          const notificationEvent: NotificationCreatedEvent = {
            uid: found.id,
            senderId: user.id,
            receiverId: inviteesIds,
            category: NotificationCategory.User,
            type: NotificationType.Dining,
            slug: found.slug,
            message: `has invited you to dine out`,
          };

          this.publisher.emit<void, NotificationCreatedEvent>(
            Subjects.NotificationCreated,
            notificationEvent,
          );
        }
      }

      return found;
    }

    throw new UnauthorizedException('User is not authorized');
  }

  // delete plan
  async deletePlan(planIdDto: PlanIdDto, user: UserDetails): Promise<string> {
    const found: PlanDocument = await this.findPlanById(planIdDto);

    if (found.userId === user.id) {
      const notificationEvent: NotificationDeletedEvent = {
        uid: found.id,
      };

      this.publisher.emit<void, NotificationDeletedEvent>(
        Subjects.NotificationDeleted,
        notificationEvent,
      );

      await found.deleteOne();
      return 'Dining Plan deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
