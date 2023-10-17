import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  authId: Types.ObjectId;
  name: string;
  cuisine: string;
  address: string;
  latitude: number;
  longitude: number;
  taxId: string;
  phoneNumber: string;
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

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cuisine: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true, unique: true, index: true })
  taxId: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Version
RestaurantSchema.set('versionKey', 'version');
RestaurantSchema.plugin(updateIfCurrentPlugin);
