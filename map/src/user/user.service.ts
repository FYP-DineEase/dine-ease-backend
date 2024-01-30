import { Injectable, NotFoundException } from '@nestjs/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from './models/user.entity';

// NATS
import {
  EventData,
  AccountCreatedEvent,
  AccountUpdatedEvent,
} from '@dine_ease/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
  ) {}

  // find restaurant by version
  async findRestaurantByVersion(event: EventData): Promise<UserDocument> {
    const found = await this.userModel.findByEvent(event);
    if (!found) throw new NotFoundException('User not found');
    return found;
  }

  // create restaurant
  async createUser(data: AccountCreatedEvent): Promise<void> {
    const { userId, ...details } = data;
    const newData = { _id: userId, ...details };
    await this.userModel.create(newData);
  }

  // update restaurant
  async updateUser(data: AccountUpdatedEvent): Promise<void> {
    const { userId, version, ...details } = data;
    const event: EventData = { id: userId, version };
    const found: UserDocument = await this.findRestaurantByVersion(event);
    found.set(details);
    await found.save();
  }
}
