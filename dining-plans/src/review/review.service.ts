import { Injectable } from '@nestjs/common';

// Database
import { RestaurantDocument } from '../restaurant/models/restaurant.entity';

// NATS
import {
  ReviewCreatedEvent,
  ReviewUpdatedEvent,
  ReviewDeletedEvent,
} from '@dine_ease/common';

// Service
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class ReviewService {
  constructor(private readonly restaurantService: RestaurantService) {}

  // create review
  async reviewCreated(data: ReviewCreatedEvent): Promise<void> {
    const { restaurantId, rating } = data;

    const restaurant: RestaurantDocument =
      await this.restaurantService.findRestaurantById(restaurantId);

    const { rating: stars, count } = restaurant;
    const updatedRating = ((stars * count + rating) / (count + 1)).toFixed(1);

    restaurant.set({ rating: updatedRating, count: count + 1 });
    await restaurant.save();
  }

  // update review
  async reviewUpdated(data: ReviewUpdatedEvent): Promise<void> {
    const { restaurantId, previousRating, rating } = data;

    const restaurant: RestaurantDocument =
      await this.restaurantService.findRestaurantById(restaurantId);

    const { rating: stars, count } = restaurant;
    const updatedRating = (
      (stars * count - previousRating + rating) /
      count
    ).toFixed(1);

    restaurant.set({ rating: updatedRating });
    await restaurant.save();
  }

  // delete review
  async reviewDeleted(data: ReviewDeletedEvent): Promise<void> {
    const { restaurantId, rating } = data;

    const restaurant: RestaurantDocument =
      await this.restaurantService.findRestaurantById(restaurantId);

    const { rating: stars, count } = restaurant;
    const updatedRating = ((stars * count - rating) / (count - 1)).toFixed(1);

    restaurant.set({ rating: updatedRating, count: count - 1 });
    await restaurant.save();
  }
}
