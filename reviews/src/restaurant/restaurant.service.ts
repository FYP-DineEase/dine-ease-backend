import { Injectable, NotFoundException } from '@nestjs/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './models/restaurant.entity';

// NATS
import {
  RestaurantApprovedEvent,
  RestaurantDeletedEvent,
  RestaurantUpdatedEvent,
} from '@dine_ease/common';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  // find restaurant by id
  async findRestaurantById(
    restaurantId: Types.ObjectId,
    includeDeleted = false,
  ): Promise<RestaurantDocument> {
    const query: Record<string, any> = { _id: restaurantId };
    if (!includeDeleted) query.isDeleted = false;

    const found: RestaurantDocument = await this.restaurantModel.findOne(query);
    if (!found) throw new NotFoundException('Restaurant not found');
    return found;
  }

  // create restaurant
  async createRestaurant(data: RestaurantApprovedEvent): Promise<void> {
    const { id: _id, name, slug, taxId } = data;
    await this.restaurantModel.create({ _id, name, slug, taxId });
  }

  // update restaurant
  async updateRestaurant(data: RestaurantUpdatedEvent): Promise<void> {
    const { id, name, slug, taxId } = data;
    const found: RestaurantDocument = await this.findRestaurantById(id, true);
    found.set({ name, slug, taxId });
    await found.save();
  }

  // delete restaurant
  async deleteRestaurant(data: RestaurantDeletedEvent): Promise<void> {
    const { id } = data;
    const found: RestaurantDocument = await this.findRestaurantById(id, true);
    found.set({ isDeleted: true });
    await found.save();
  }
}
