import { Injectable } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './models/notification.entity';

// NATS
import { AccountCreatedEvent } from '@dine_ease/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  // get user notifications
  async getNotifications(user: UserDetails): Promise<NotificationDocument[]> {
    const found: NotificationDocument[] = await this.notificationModel.find({
      receiverId: user.id,
    });
    return found;
  }

  // create notification
  async createNotification(data: AccountCreatedEvent): Promise<void> {
    const { userId, ...details } = data;
    const newData = { _id: userId, ...details };
    await this.notificationModel.create(newData);
  }

  // delete notification
  async deleteNotification(data: AccountCreatedEvent): Promise<void> {}
}
