import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  AuthGuard,
  GetUser,
  UserDetails,
  MaxImageSizeValidator,
} from '@dine_ease/common';

import { FileInterceptor } from '@nestjs/platform-express';

// User
import { UserService } from './user.service';
import { UserDocument } from './models/user.entity';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Subjects, AccountCreatedEvent } from '@dine_ease/common';

// DTO
import { UserSlugDto } from './dto/slug.dto';
import { UserIdDto, UsersDto } from './dto/mongo-id.dto';
import { UserStorageDto } from './dto/storage.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('details')
  @UseGuards(AuthGuard)
  async userDetails(@GetUser() user: UserDetails): Promise<UserDocument> {
    return this.userService.getUserById(user.id);
  }

  @Get('details/:userId')
  async userDetailsById(@Param() userIdDto: UserIdDto): Promise<UserDocument> {
    return this.userService.getUserById(userIdDto.userId);
  }

  @Get('slug/:slug')
  async userDetailsBySlug(
    @Param() userSlugDto: UserSlugDto,
  ): Promise<UserDocument> {
    return this.userService.getUserBySlug(userSlugDto);
  }

  @Get('all/slug')
  async getAllUserSlugs(): Promise<UserDocument[]> {
    return this.userService.getAllUserSlugs();
  }

  // due to GET limitations
  @Post('by-ids')
  async getUserByIds(
    @Body() usersDto: UsersDto,
  ): Promise<Record<string, UserDocument>> {
    return this.userService.getUserByIds(usersDto);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    file: Express.Multer.File,
    @Body() userStorageDto: UserStorageDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.userService.uploadUserImage(file, userStorageDto, user);
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
}
