import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AccountCreatedEvent, Subjects } from '@dine_ease/common';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(Subjects.AccountCreated)
  registerUnverified(
    @Payload() data: AccountCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ) {
    this.userService.registerUnverified(data);
    context.message.ack();
  }
}
