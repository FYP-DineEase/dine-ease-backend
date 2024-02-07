import { Controller, Get, UseGuards } from '@nestjs/common';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  AccountCreatedEvent,
  AuthGuard,
  GetUser,
  UserDetails,
} from '@dine_ease/common';

// Database
import { NotificationDocument } from './models/notification.entity';

// Service
import { NotificationService } from './notification.service';

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

  // read endpoint
}
