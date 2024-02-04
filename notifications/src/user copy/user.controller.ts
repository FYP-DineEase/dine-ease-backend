import { Controller } from '@nestjs/common';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  AccountCreatedEvent,
  AccountUpdatedEvent,
} from '@dine_ease/common';

// Service
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(Subjects.AccountCreated)
  async createUser(
    @Payload() data: AccountCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.createUser(data);
    context.message.ack();
  }

  @EventPattern(Subjects.AccountUpdated)
  async updateUser(
    @Payload() data: AccountUpdatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.updateUser(data);
    context.message.ack();
  }
}
