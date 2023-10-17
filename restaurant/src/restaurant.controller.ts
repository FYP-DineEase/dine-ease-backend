import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// Restaurant
import { RestaurantService } from './restaurant.service';
import { RestaurantDocument } from './models/restaurant.entity';

// Nats
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  AccountCreatedEvent,
  AvatarUploadedEvent,
  Subjects,
} from '@dine_ease/common';

// DTO
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('/api/user')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  getAllRestaurants(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getAllRestaurants();
  }

  @Get('verified')
  userDetails(@GetUser() user: UserDetails): Promise<RestaurantDocument[]> {
    return this.restaurantService.getUser(user.id);
  }

  @Get('un-verified')
  @UseGuards(AuthGuard)
  userDetails(@GetUser() user: UserDetails): Promise<UserDocument> {
    return this.restaurantService.getUser(user.id);
  }
}
