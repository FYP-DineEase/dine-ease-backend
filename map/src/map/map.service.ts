import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';
import { nanoid } from 'nanoid';

// Services
import { RestaurantService } from 'src/restaurant/restaurant.service';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { Subjects, MapCreatedEvent } from '@dine_ease/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Map, MapDocument } from './models/map.entity';

// DTO
import { MapSlugDto } from './dto/map-slug.dto';
import { MapThemeDto } from './dto/map-theme.dto';
import { RestaurantDto } from './dto/restaurant.dto';

@Injectable()
export class MapService {
  constructor(
    private readonly publisher: Publisher,
    private readonly restaurantService: RestaurantService,
    @InjectModel(Map.name)
    private readonly mapModel: Model<MapDocument>,
  ) {}

  // fetch all user slugs
  async getAllMapSlugs(): Promise<MapDocument[]> {
    const found: MapDocument[] = await this.mapModel
      .find({}, { _id: 0, slug: 1 })
      .lean();
    return found;
  }

  // find map by slug
  async findMapBySlug(mapSlugDto: MapSlugDto): Promise<MapDocument> {
    const { slug } = mapSlugDto;
    const found: MapDocument = await this.mapModel.findOne({ slug }).populate([
      {
        path: 'restaurants',
        model: 'Restaurant',
        match: { isDeleted: { $ne: true } },
      },
      { path: 'userId' },
    ]);
    if (!found) throw new NotFoundException('User map not found');
    return found;
  }

  // add a restaurant to map
  async addRestaurant(
    restaurantDto: RestaurantDto,
    user: UserDetails,
  ): Promise<string> {
    const userId = user.id;
    const restaurantId = new Types.ObjectId(restaurantDto.restaurantId);

    await this.restaurantService.findRestaurantById(restaurantId);

    let found: MapDocument = await this.mapModel.findOne({ userId });

    if (!found) {
      const slug = nanoid(10);
      const event: MapCreatedEvent = { userId, slug };
      this.publisher.emit<void, MapCreatedEvent>(Subjects.MapCreated, event);

      found = await this.mapModel.create({ userId, slug });
    }

    found.restaurants.push(restaurantId);
    await found.save();

    return 'Restaurant added successfully';
  }

  // update map theme
  async updateTheme(
    mapThemeDto: MapThemeDto,
    user: UserDetails,
  ): Promise<string> {
    const { theme } = mapThemeDto;
    const userId = user.id;

    const found: MapDocument = await this.mapModel.findOneAndUpdate(
      { userId },
      { theme },
    );

    if (!found) throw new NotFoundException('User map not found');
    return 'Restaurant theme updated successfully';
  }

  // delete a restaurant from  map
  async deleteRestaurant(
    restaurantDto: RestaurantDto,
    user: UserDetails,
  ): Promise<string> {
    const userId = user.id;
    const { restaurantId } = restaurantDto;

    const found: MapDocument = await this.mapModel.findOneAndUpdate(
      { userId },
      { $pull: { restaurants: new Types.ObjectId(restaurantId) } },
    );

    if (!found) throw new NotFoundException('User map not found');
    return 'Restaurant deleted successfully';
  }
}
