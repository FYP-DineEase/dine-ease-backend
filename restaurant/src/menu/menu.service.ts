import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { StatusTypes, UserDetails } from '@dine_ease/common';

// Services
import { S3Service } from 'src/services/aws-s3.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem, MenuDocument } from './models/menu.entity';
import { RestaurantDocument } from 'src/restaurants/models/restaurant.entity';

// DTO
import { MenuIdDto, RestaurantIdDto } from './dto/mongo-id.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuOrderDto } from './dto/menu-order.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly restaurantsService: RestaurantsService,
    @InjectModel(MenuItem.name)
    private readonly menuModel: Model<MenuDocument>,
  ) {}

  // find restaurant menu item
  async getMenuItem(
    idDto: MenuIdDto,
    user: UserDetails,
  ): Promise<{ found: RestaurantDocument; menuItemIndex: number }> {
    const { menuId } = idDto;

    const found: RestaurantDocument =
      await this.restaurantsService.findRestaurantById(idDto, user);

    const menuItemIndex = found.menu.findIndex(
      (item) => item.id.toString() === menuId,
    );

    if (menuItemIndex === -1) {
      throw new NotFoundException('Menu Item not found');
    }

    return { found, menuItemIndex };
  }

  // create a restaurant menu item
  async createMenuItem(
    idDto: RestaurantIdDto,
    user: UserDetails,
    menuItemDto: CreateMenuItemDto,
    file: Express.Multer.File,
  ): Promise<MenuDocument> {
    const { restaurantId } = idDto;
    const { name, price, category, description, order } = menuItemDto;

    const found = await this.restaurantsService.findRestaurantById(idDto, user);

    if (found.status !== StatusTypes.APPROVED) {
      throw new BadRequestException('Restaurant status should be approved');
    }

    const image = await this.s3Service.upload(`${restaurantId}/menu`, file);

    const menuItem: MenuDocument = new this.menuModel({
      name,
      price,
      category,
      description,
      order,
      image,
    });
    found.menu.push(menuItem);
    await found.save();

    return menuItem;
  }

  // update a restaurant menu item
  async updateMenuById(
    idDto: MenuIdDto,
    user: UserDetails,
    menuItemDto: UpdateMenuItemDto,
    file: Express.Multer.File,
  ): Promise<MenuDocument> {
    const { restaurantId } = idDto;

    const { name, price, description } = menuItemDto;
    const updatedData = { name, price, description };

    const { found, menuItemIndex } = await this.getMenuItem(idDto, user);
    const menuItem = found.menu[menuItemIndex];

    if (file) {
      const path = `${restaurantId}/menu`;
      const newImage = await this.s3Service.upload(path, file);
      await this.s3Service.deleteOne(`${path}/${menuItem.image}`);
      menuItem.image = newImage;
    }

    found.menu[menuItemIndex].set({
      ...menuItem,
      ...updatedData,
    });

    await found.save();

    return found.menu[menuItemIndex];
  }

  // update a restaurant menu items
  async updateMenu(
    idDto: RestaurantIdDto,
    user: UserDetails,
    menuOrderDto: MenuOrderDto,
  ): Promise<MenuDocument[]> {
    const { orders } = menuOrderDto;

    const found = await this.restaurantsService.findRestaurantById(idDto, user);

    found.menu.forEach((i) => {
      const orderItem = orders.find((o) => o.id === i.id);
      if (orderItem) i.order = orderItem.value;
    });

    await found.save();

    return found.menu;
  }

  // delete a restaurant menu item
  async deleteMenuItem(
    idDto: MenuIdDto,
    user: UserDetails,
  ): Promise<MenuDocument[]> {
    const { found, menuItemIndex } = await this.getMenuItem(idDto, user);

    const { category, order } = found.menu[menuItemIndex];
    found.menu.splice(menuItemIndex, 1);

    found.menu.forEach((i) => {
      if (i.category === category && order < i.order) {
        i.order -= 1;
      }
    });

    await found.save();

    return found.menu;
  }
}
