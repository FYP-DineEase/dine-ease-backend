import { Controller } from '@nestjs/common';

// NATS
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  ReviewCreatedEvent,
  ReviewUpdatedEvent,
  ReviewDeletedEvent,
} from '@dine_ease/common';

// Service
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @EventPattern(Subjects.ReviewCreated)
  async createRestaurant(
    @Payload() data: ReviewCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.reviewService.reviewCreated(data);
    context.message.ack();
  }

  @EventPattern(Subjects.ReviewUpdated)
  async updateRestaurant(
    @Payload() data: ReviewUpdatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.reviewService.reviewUpdated(data);
    context.message.ack();
  }

  @EventPattern(Subjects.ReviewDeleted)
  async reviewDeleted(
    @Payload() data: ReviewDeletedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.reviewService.reviewDeleted(data);
    context.message.ack();
  }
}
