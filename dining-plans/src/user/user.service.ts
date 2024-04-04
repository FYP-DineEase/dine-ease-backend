import { Injectable, NotFoundException } from '@nestjs/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from './models/user.entity';
import { Types } from 'mongoose';

// NATS
import {
  EventData,
  AccountCreatedEvent,
  AccountUpdatedEvent,
} from '@dine_ease/common';

// DTO
import { EmailsDto } from './dto/emails.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,
  ) {}

  // find user ids
  async findIds(emailsDto: EmailsDto): Promise<Types.ObjectId[]> {
    const { emails } = emailsDto;
    const users: UserDocument[] = await this.userModel
      .find({
        email: { $in: emails },
      })
      .select('id');

    const ids: Types.ObjectId[] = users.map((user) => user._id);
    return ids;
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
    const found = await this.userModel.findByEvent(event);

    if (!found) throw new NotFoundException('User not found');
    found.set(details);
    await found.save();
  }
}
