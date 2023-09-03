import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface CartDocument extends HydratedDocument<Cart> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  websiteId: Types.ObjectId;
  playlists: Types.ObjectId[];
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Cart {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  websiteId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Playlist' }])
  playlists: Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
