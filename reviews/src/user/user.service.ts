import { Injectable, NotFoundException } from '@nestjs/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './models/user.entity';

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
    const found = await this.userModel.findByEvent(event);

    if (!found) throw new NotFoundException('User not found');
    found.set(details);
    await found.save();
  }
}
