import { Injectable } from '@nestjs/common';
import { NotificationDeletedEvent, UserDetails } from '@dine_ease/common';

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
import { NotificationCreatedEvent } from '@dine_ease/common';
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
      .populate({
        path: 'senderId',
        model: 'User',
        select: 'name avatar slug',
      });
    return found;
  }

  // create notification
  async createNotification(data: NotificationCreatedEvent): Promise<void> {
    // If receiverId is not an array, convert it to an array to unify handling
    if (!Array.isArray(data.receiverId)) {
      data.receiverId = [data.receiverId];
    }

    let notification: NotificationDocument;

    const creationPromises = await Promise.all(
      data.receiverId.map(async (receiver) => {
        const { receiverId: _, ...details } = data;
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

    data.senderId = populatedNotification.senderId;

    data.receiverId.forEach(async (v) => {
      const { receiverId: _, ...details } = data;
      console.log(details);
      const receiver = await this.redisService.getValue(String(v));
      this.socketService.socket.to(receiver).emit('notification', details);
    });
  }

  // read notifications
  async readNotifications(readDto: ReadDto, user: UserDetails): Promise<void> {
    const { ids } = readDto;
    // const found: NotificationDocument[] = await this.notificationModel.find({
    //   receiverId: user.id,
    // });
    // return found;
  }

  // delete notification
  async deleteNotification(data: NotificationDeletedEvent): Promise<void> {
    const { uid } = data;
    await this.notificationModel.updateMany(
      { uid },
      { $set: { isDeleted: true } },
    );
  }
}
