import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// User
import { UserService } from './user.service';
import { UserDocument } from './models/user.entity';

// Nats
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  AccountCreatedEvent,
  AvatarUploadedEvent,
  Subjects,
} from '@dine_ease/common';

// DTO
import { AuthDto } from './dto/auth.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('details')
  @UseGuards(AuthGuard)
  userDetails(@GetUser() user: UserDetails): Promise<UserDocument> {
    return this.userService.getUser(user.id);
  }

  @Get('login/:authId')
  async login(@Param() authDto: AuthDto): Promise<UserDocument> {
    return this.userService.findAuthUser(authDto);
  }

  @Get('verify')
  verifyAccount(@Query('token') token: string): Promise<string> {
    return this.userService.verifyAccount(token);
  }

  @EventPattern(Subjects.AccountCreated)
  async registerUnverified(
    @Payload() data: AccountCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.registerUnverified(data);
    context.message.ack();
  }

  @EventPattern(Subjects.StorageAvatarUploaded)
  async updateAvatar(
    @Payload() data: AvatarUploadedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.updateAvatar(data);
    context.message.ack();
  }
}
