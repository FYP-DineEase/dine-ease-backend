import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Subjects, AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import {
  NotificationDeletedEvent,
  NotificationCreatedEvent,
} from '@dine_ease/common';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Database
import { NotificationDocument } from './models/notification.entity';

// Service
import { NotificationService } from './notification.service';

// DTO
import { ReadDto } from './dto/read.dto';

@Controller('/api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getNotifications(
    @GetUser() user: UserDetails,
  ): Promise<NotificationDocument[]> {
    return this.notificationService.getNotifications(user);
  }

  @Post()
  @UseGuards(AuthGuard)
  async readNotifications(
    @Body() readDto: ReadDto,
    @GetUser() user: UserDetails,
  ): Promise<void> {
    return this.notificationService.readNotifications(readDto, user);
  }

  @EventPattern(Subjects.NotificationCreated)
  async createNotification(
    @Payload() data: NotificationCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.notificationService.createNotification(data);
    context.message.ack();
  }

  @EventPattern(Subjects.NotificationDeleted)
  async deleteNotification(
    @Payload() data: NotificationDeletedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.notificationService.deleteNotification(data);
    context.message.ack();
  }
}
