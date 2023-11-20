import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// User
import { UserService } from './user.service';
import { UserDocument } from './models/user.entity';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  AccountCreatedEvent,
  UserStorageUploadedEvent,
} from '@dine_ease/common';

// DTO
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

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

  @Get('all')
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userService.getAllUsers();
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @GetUser() user: UserDetails,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateProfile(user, updateUserDto);
  }

  @Patch('location')
  @UseGuards(AuthGuard)
  async updateLocation(
    @GetUser() user: UserDetails,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<string> {
    return this.userService.updateLocation(user, updateLocationDto);
  }

  @Delete('location')
  @UseGuards(AuthGuard)
  async deleteLocation(@GetUser() user: UserDetails): Promise<string> {
    return this.userService.deleteLocation(user);
  }

  @EventPattern(Subjects.AccountCreated)
  async registerUnverified(
    @Payload() data: AccountCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.registerUnverified(data);
    context.message.ack();
  }

  @EventPattern(Subjects.StorageUserUploaded)
  async updateUserImage(
    @Payload() data: UserStorageUploadedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.userService.updateUserImage(data);
    context.message.ack();
  }
}
