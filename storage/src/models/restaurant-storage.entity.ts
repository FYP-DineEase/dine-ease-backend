import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RestaurantStorage } from '@dine_ease/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  uploaderId: Types.ObjectId;
  type: RestaurantStorage;
  images: [string];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  timestamps: true,
})
export class Restaurant {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ type: { menuId: Types.ObjectId, images: [String] } })
  menu: {
    menuId: Types.ObjectId;
    images: string[];
  };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Version
RestaurantSchema.set('versionKey', 'version');
RestaurantSchema.plugin(updateIfCurrentPlugin);
