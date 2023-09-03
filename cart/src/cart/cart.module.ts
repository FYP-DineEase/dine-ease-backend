// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@mujtaba-web/common';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
  imports: [
    JwtAuthModule,
    PlaylistModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
