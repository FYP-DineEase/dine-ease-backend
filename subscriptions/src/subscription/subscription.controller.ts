import { Controller, Param, Get, Post, UseGuards, Body } from '@nestjs/common';
import {
  AuthGuard,
  Roles,
  RolesGuard,
  AdminRoles,
  UserRoles,
} from '@dine_ease/common';

import { SubscriptionService } from './subscription.service';
import { SubscriptionDocument } from './models/subscription.entity';

// DTO
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { PaymentIntentDto } from './dto/payment-intent.dto';
import { SubscriptionDto } from './dto/subscription.dto';

@Controller('/api/subscription')
@UseGuards(AuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @Roles(AdminRoles.ADMIN)
  getSubscriptions(): Promise<SubscriptionDocument[]> {
    return this.subscriptionService.getSubscriptions();
  }

  @Get('/:restaurantId')
  @Roles(AdminRoles.ADMIN, UserRoles.MANAGER)
  getRestaurantSubscriptions(
    @Param() restaurantId: RestaurantIdDto,
  ): Promise<SubscriptionDocument[]> {
    return this.subscriptionService.getRestaurantSubscriptions(restaurantId);
  }

  @Post()
  @Roles(UserRoles.MANAGER)
  createSubscription(
    @Body() subscriptionDto: SubscriptionDto,
  ): Promise<string> {
    return this.subscriptionService.createSubscription(subscriptionDto);
  }

  @Post('/create-intent')
  @Roles(UserRoles.MANAGER)
  createIntent(@Body() paymentIntentDto: PaymentIntentDto): Promise<string> {
    return this.subscriptionService.createIntent(paymentIntentDto);
  }
}
