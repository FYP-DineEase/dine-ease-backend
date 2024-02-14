import { Injectable, NotFoundException } from '@nestjs/common';

// NATS
import {
  EventData,
  ReviewCreatedEvent,
  ReviewUpdatedEvent,
  ReviewDeletedEvent,
} from '@dine_ease/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument, ReviewModel } from './models/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: ReviewModel,
  ) {}

  // find restaurant by version
  async findRestaurantByVersion(event: EventData): Promise<ReviewDocument> {
    const found = await this.reviewModel.findByEvent(event);
    if (!found) throw new NotFoundException('Review not found');
    return found;
  }

  // create review
  async reviewCreated(data: ReviewCreatedEvent): Promise<void> {
    const { id, ...details } = data;
    const newData = { _id: id, ...details };
    await this.reviewModel.create(newData);
  }

  // update review
  async reviewUpdated(data: ReviewUpdatedEvent): Promise<void> {
    const { id, version, ...details } = data;
    const event: EventData = { id, version };
    const found: ReviewDocument = await this.findRestaurantByVersion(event);
    found.set(details);
    await found.save();
  }

  // delete review
  async reviewDeleted(data: ReviewDeletedEvent): Promise<void> {
    const { id, version } = data;
    const event: EventData = { id, version };
    const found: ReviewDocument = await this.findRestaurantByVersion(event);
    found.set({ isDeleted: true });
    await found.save();
  }
}
