import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  Roles,
  RolesGuard,
  UserRoles,
  AuthGuard,
  GetUser,
  UserDetails,
  MaxImageSizeValidator,
} from '@dine_ease/common';

import { FileInterceptor } from '@nestjs/platform-express';

// Services
import { MenuService } from './menu.service';

// DTO
import { MenuIdDto, RestaurantIdDto } from './dto/mongo-id.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuOrderDto } from './dto/menu-order.dto';

// Database
import { MenuDocument } from './models/menu.entity';

@Controller('/api/menu/:restaurantId')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.MANAGER)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createMenuItem(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    image: Express.Multer.File,
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() menuItemDto: CreateMenuItemDto,
  ): Promise<MenuDocument> {
    return this.menuService.createMenuItem(idDto, user, menuItemDto, image);
  }

  @Patch('/:menuId')
  @UseInterceptors(FileInterceptor('image'))
  updateMenuById(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        fileIsRequired: false,
      }),
      new MaxImageSizeValidator({ fileIsRequired: false }),
    )
    image: Express.Multer.File | undefined,
    @Param() idDto: MenuIdDto,
    @GetUser() user: UserDetails,
    @Body() menuItemDto: UpdateMenuItemDto,
  ): Promise<MenuDocument> {
    return this.menuService.updateMenuById(idDto, user, menuItemDto, image);
  }

  @Patch()
  updateMenu(
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() menuOrderDto: MenuOrderDto,
    ): Promise<MenuDocument[]> {
    return this.menuService.updateMenu(idDto, user, menuOrderDto);
  }

  @Delete('/:menuId')
  deleteMenuItem(
    @Param() idDto: MenuIdDto,
    @GetUser() user: UserDetails,
  ): Promise<MenuDocument[]> {
    return this.menuService.deleteMenuItem(idDto, user);
  }
}
