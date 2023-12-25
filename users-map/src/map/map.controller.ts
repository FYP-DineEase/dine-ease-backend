import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard, GetUser, UserDetails } from '@dine_ease/common';

// Restaurant
import { MapService } from './map.service';
import { MapDocument } from './models/map.entity';

// DTO
import { MapSlugDto } from './dto/map-slug.dto';
import { MapThemeDto } from './dto/map-theme.dto';
import { RestaurantDto } from './dto/restaurant.dto';

@Controller('/api/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('/:slug')
  async getRestaurantReviews(@Param() slug: MapSlugDto): Promise<MapDocument> {
    return this.mapService.findMapBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  async addRestaurant(
    @GetUser() user: UserDetails,
    @Body() restaurantDto: RestaurantDto,
  ): Promise<string> {
    return this.mapService.addRestaurant(restaurantDto, user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateTheme(
    @GetUser() user: UserDetails,
    @Body() mapThemeDto: MapThemeDto,
  ): Promise<string> {
    return this.mapService.updateTheme(mapThemeDto, user);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteMapRestaurant(@GetUser() user: UserDetails): Promise<string> {
    return this.mapService.deleteMap(user);
  }

  @Delete('/:restaurantId')
  @UseGuards(AuthGuard)
  async deleteRestaurant(
    @Param() id: RestaurantDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.mapService.deleteRestaurant(id, user);
  }
}
