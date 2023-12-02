import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  AuthGuard,
  GetUser,
  Roles,
  RolesGuard,
  UserDetails,
  UserRoles,
} from '@dine_ease/common';

// Services
import { MenuService } from './menu.service';

// Database
import { MenuItem } from './models/menu.entity';

// DTO
import { MenuIdDto, RestaurantIdDto } from './dto/mongo-id.dto';
import { MenuItemDto } from './dto/menu-item.dto';
import { MenuOrderDto } from './dto/menu-order.dto';

@Controller('/api/menu/:restaurantId')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.MANAGER)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getRestaurantMenu(@Param() idDto: RestaurantIdDto): Promise<MenuItem[]> {
    return this.menuService.getRestaurantMenu(idDto);
  }

  @Post()
  createMenuItem(
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() menuItemDto: MenuItemDto,
  ): Promise<string> {
    return this.menuService.createMenuItem(idDto, user, menuItemDto);
  }

  @Patch('/:menuId')
  updateMenuById(
    @Param() idDto: MenuIdDto,
    @GetUser() user: UserDetails,
    @Body() menuItemDto: MenuItemDto,
  ): Promise<string> {
    return this.menuService.updateMenuById(idDto, user, menuItemDto);
  }

  @Patch()
  updateMenu(
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() menuOrderDto: MenuOrderDto,
  ): Promise<string> {
    return this.menuService.updateMenu(idDto, user, menuOrderDto);
  }

  @Delete('/:menuId')
  deleteMenuItem(
    @Param() idDto: MenuIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.menuService.deleteMenuItem(idDto, user);
  }
}
