import { Injectable, NotFoundException } from '@nestjs/common';
import { WebsiteUserDetails } from '@mujtaba-web/common';
import { PlaylistService } from 'src/playlist/playlist.service';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly playlistService: PlaylistService,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  // find user cart
  async findCart(
    user: WebsiteUserDetails,
    websiteId: Types.ObjectId,
  ): Promise<CartDocument> {
    const cart = await this.cartModel
      .findOne({
        userId: user.id,
        websiteId,
      })
      .populate({
        path: 'playlists',
        model: 'Playlist',
      })
      .exec();

    if (!cart) throw new NotFoundException('Cart not found');

    return cart;
  }

  // create or update cart
  async createOrUpdateCart(
    user: WebsiteUserDetails,
    websiteId: Types.ObjectId,
    playlistId: Types.ObjectId,
  ): Promise<string> {
    const { id } = await this.playlistService.findPlaylist(
      playlistId,
      websiteId,
    );
    const existingCart: CartDocument = await this.cartModel.findOneAndUpdate(
      { userId: user.id, websiteId },
      { $addToSet: { playlists: id } },
      { upsert: true },
    );

    if (existingCart) {
      return 'Playlist Added to Cart Successfully';
    } else {
      return 'Cart Created Successfully';
    }
  }

  // delete cart
  async deleteCart(
    user: WebsiteUserDetails,
    websiteId: Types.ObjectId,
  ): Promise<string> {
    const cart = await this.cartModel.findOneAndDelete({
      userId: user.id,
      websiteId,
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return `Cart Deleted Successfully`;
  }
}
