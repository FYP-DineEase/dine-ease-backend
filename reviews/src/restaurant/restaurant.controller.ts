import { Controller } from '@nestjs/common';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  RestaurantApprovedEvent,
  RestaurantDeletedEvent,
  RestaurantUpdatedEvent,
} from '@dine_ease/common';

// Service
import { RestaurantService } from './restaurant.service';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @EventPattern(Subjects.RestaurantApproved)
  async createRestaurant(
    @Payload() data: RestaurantApprovedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.restaurantService.createRestaurant(data);
    context.message.ack();
  }

  @EventPattern(Subjects.RestaurantUpdated)
  async updateRestaurant(
    @Payload() data: RestaurantUpdatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.restaurantService.updateRestaurant(data);
    context.message.ack();
  }

  @EventPattern(Subjects.RestaurantDeleted)
  async deleteRestaurant(
    @Payload() data: RestaurantDeletedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.restaurantService.deleteRestaurant(data);
    context.message.ack();
  }
}
