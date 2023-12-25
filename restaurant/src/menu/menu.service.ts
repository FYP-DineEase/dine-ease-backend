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
import { MenuItemDto } from './dto/menu-item.dto';
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
      await this.restaurantsService.findRestaurantById(idDto);

    if (user.id !== found.userId) {
      throw new UnauthorizedException('User is not authorized');
    }

    const menuItemIndex = found.menu.findIndex(
      (item) => item.id.toString() === menuId,
    );

    if (menuItemIndex === -1) {
      throw new NotFoundException('Menu Item not found');
    }

    return { found, menuItemIndex };
  }

  // all restaurant menu items
  async getRestaurantMenu(idDto: RestaurantIdDto): Promise<MenuItem[]> {
    const found = await this.restaurantsService.findRestaurantById(idDto);
    return found.menu;
  }

  // upload item image
  async uploadItemImage(
    idDto: MenuIdDto,
    file: Express.Multer.File,
    user: UserDetails,
  ): Promise<string> {
    const { restaurantId } = idDto;
    const { found, menuItemIndex } = await this.getMenuItem(idDto, user);

    const menuItem = found.menu[menuItemIndex];
    const deleteKey = menuItem.image;
    const path = `${restaurantId}/menu`;

    const newImage = await this.s3Service.upload(path, file);
    menuItem.set({ image: newImage });
    await found.save();

    if (deleteKey) {
      await this.s3Service.deleteOne(`${path}/${deleteKey}`);
    }

    return 'Menu Image Updated Successfully';
  }

  // create a restaurant menu item
  async createMenuItem(
    idDto: RestaurantIdDto,
    user: UserDetails,
    menuItemDto: MenuItemDto,
  ): Promise<string> {
    const found = await this.restaurantsService.findRestaurantById(idDto);

    if (user.id !== found.userId) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (found.status !== StatusTypes.APPROVED) {
      throw new BadRequestException('Restaurant status should be approved');
    }

    const updatedItem = { ...menuItemDto, order: found.menu.length };
    const menuItem = new this.menuModel(updatedItem);
    found.menu.push(menuItem);
    await found.save();

    return 'Menu item added successfully';
  }

  // update a restaurant menu item
  async updateMenuById(
    idDto: MenuIdDto,
    user: UserDetails,
    menuItemDto: MenuItemDto,
  ): Promise<string> {
    const { found, menuItemIndex } = await this.getMenuItem(idDto, user);

    const newItem = { ...found.menu[menuItemIndex], ...menuItemDto };
    Object.assign(found.menu[menuItemIndex], newItem);
    await found.save();

    return 'Menu item updated successfully';
  }

  // update a restaurant menu items
  async updateMenu(
    idDto: RestaurantIdDto,
    user: UserDetails,
    menuOrderDto: MenuOrderDto,
  ): Promise<string> {
    const { category, orders } = menuOrderDto;

    const found = await this.restaurantsService.findRestaurantById(idDto);

    if (user.id !== found.userId) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (orders.length !== found.menu.length) {
      throw new BadRequestException('Invalid order provided');
    }

    orders.forEach((order) => {
      const updatedOrder = order.value;
      const updateItem = found.menu.find(
        (item) => item.id.toString() === order.id,
      );

      if (updatedOrder > found.menu.length - 1) {
        throw new BadRequestException('Invalid order number provided');
      }

      if (!updateItem || updateItem.category !== category) {
        throw new NotFoundException(`Menu item with id ${order.id} not found.`);
      } else {
        updateItem.order = updatedOrder;
      }
    });

    await found.save();

    return 'Menu order updated successfully';
  }

  // delete a restaurant menu item
  async deleteMenuItem(idDto: MenuIdDto, user: UserDetails): Promise<string> {
    const { menuId } = idDto;
    const found = await this.restaurantsService.findRestaurantById(idDto);

    if (user.id !== found.userId) {
      throw new UnauthorizedException('User is not authorized');
    }

    const menuItemIndex = found.menu.findIndex(
      (item) => item.id.toString() === menuId,
    );

    if (menuItemIndex === -1) {
      throw new NotFoundException('Menu Item not found');
    }

    found.menu.splice(menuItemIndex, 1);

    for (let i = menuItemIndex; i < found.menu.length; i++) {
      found.menu[i].order -= 1;
    }

    await found.save();

    return 'Menu item updated successfully';
  }
}
