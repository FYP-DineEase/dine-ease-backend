import {
  Get,
  Post,
  Delete,
  Param,
  Body,
  Controller,
  UseGuards,
} from '@nestjs/common';
import {
  GetWebsiteUser,
  WebsiteAuthGuard,
  WebsiteUserDetails,
} from '@mujtaba-web/common';
import { Types } from 'mongoose';
import { CartService } from './cart.service';
import { CartDocument } from './schemas/cart.schema';

@UseGuards(WebsiteAuthGuard)
@Controller('/api/cart/:websiteId')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findCart(
    @GetWebsiteUser() user: WebsiteUserDetails,
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<CartDocument> {
    return this.cartService.findCart(user, webId);
  }

  @Post()
  async createOrUpdateCart(
    @GetWebsiteUser() user: WebsiteUserDetails,
    @Param('websiteId') webId: Types.ObjectId,
    @Body('playlistId') playlistId: Types.ObjectId,
  ): Promise<string> {
    return this.cartService.createOrUpdateCart(user, webId, playlistId);
  }

  @Delete()
  deleteSection(
    @GetWebsiteUser() user: WebsiteUserDetails,
    @Param('websiteId') webId: Types.ObjectId,
  ): Promise<string> {
    return this.cartService.deleteCart(user, webId);
  }
}
