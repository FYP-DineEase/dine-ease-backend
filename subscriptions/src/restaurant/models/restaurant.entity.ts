import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  name: string;
  slug: string;
  taxId: string;
  customerId: string;
  isDeleted: boolean;
  featuredTill: Date;
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
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, unique: true, index: true })
  taxId: string;

  @Prop()
  customerId: string;

  @Prop()
  featuredTill: Date;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
