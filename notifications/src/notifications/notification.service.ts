import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './models/notification.entity';

// Services
import { SocketService } from 'src/services/socket.service';

// NATS
import {
  NotificationCreatedEvent,
  NotificationUpdatedEvent,
  NotificationDeletedEvent,
} from '@dine_ease/common';
import { RedisService } from 'src/redis/redis.service';

// DTO
import { ReadDto } from './dto/read.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly redisService: RedisService,
    private readonly socketService: SocketService,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  // get user notifications
  async getNotifications(user: UserDetails): Promise<NotificationDocument[]> {
    const found: NotificationDocument[] = await this.notificationModel
      .find({
        receiverId: user.id,
        isDeleted: false,
      })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'senderId',
        model: 'User',
        select: 'name avatar slug',
      });
    return found;
  }

  // create notification
  async createNotification(data: NotificationCreatedEvent): Promise<void> {
    if (!Array.isArray(data.receiverId)) {
      data.receiverId = [data.receiverId];
    }

    let notification: NotificationDocument;
    const { receiverId: receivers, ...details } = data;

    const creationPromises = await Promise.all(
      receivers.map(async (receiver) => {
        notification = await this.notificationModel.create({
          ...details,
          receiverId: receiver,
        });
      }),
    );

    await Promise.all(creationPromises);

    const populatedNotification = await notification.populate({
      path: 'senderId',
      model: 'User',
      select: 'name avatar slug',
    });

    receivers.forEach(async (v) => {
      const receiver = await this.redisService.getValue(String(v));
      this.socketService.socket
        .to(receiver)
        .emit('notification-created', populatedNotification);
    });
  }

  // read notifications
  async readNotifications(readDto: ReadDto, user: UserDetails): Promise<void> {
    const { ids } = readDto;

    await this.notificationModel.updateMany(
      { _id: { $in: ids }, receiverId: String(user.id) },
      { $set: { isRead: true } },
    );
  }

  // update notifications
  async updateNotification(data: NotificationUpdatedEvent): Promise<void> {
    const { uid, message, updatedAt } = data;

    const notification: NotificationDocument = await this.notificationModel
      .findOneAndUpdate(
        { uid },
        { message, updatedAt, isRead: false },
        { new: true },
      )
      .populate({
        path: 'senderId',
        model: 'User',
        select: 'name avatar slug',
      });

    if (!notification) throw new NotFoundException('Notification not found');

    const receiver = await this.redisService.getValue(
      String(notification.receiverId),
    );

    this.socketService.socket
      .to(receiver)
      .emit('notification-updated', notification);
  }

  // delete notification
  async deleteNotification(data: NotificationDeletedEvent): Promise<void> {
    const { uid } = data;

    await this.notificationModel.updateMany(
      { uid },
      { $set: { isDeleted: true } },
    );

    const notifications: NotificationDocument[] = await this.notificationModel
      .find({ uid })
      .select('receiverId');

    if (notifications.length === 0) {
      throw new NotFoundException('Notifications not found');
    }

    notifications.forEach(async (u) => {
      const receiver = await this.redisService.getValue(String(u.receiverId));
      this.socketService.socket
        .to(receiver)
        .emit('notification-deleted', { uid });
    });
  }
}
