import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Status, StatusTypes } from 'src/enums/restaurant-status.enum';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  authId: Types.ObjectId;
  name: string;
  cuisine: string[];
  address: string;
  latitude: number;
  longitude: number;
  taxId: string;
  phoneNumber: string;
  status: Status;
  isVerified: boolean;
  isDeleted: boolean;
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

  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, type: [String] })
  cuisine: string[];

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

  @Prop({
    required: true,
    enum: StatusTypes,
    default: StatusTypes.PENDING,
  })
  status: Status;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Version
RestaurantSchema.set('versionKey', 'version');
RestaurantSchema.plugin(updateIfCurrentPlugin);
