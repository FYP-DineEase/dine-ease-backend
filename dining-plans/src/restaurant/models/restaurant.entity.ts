import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { EventData } from '@dine_ease/common';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  name: string;
  slug: string;
  taxId: string;
  cuisine: string[];
  images: string[];
  address: string;
  location: {
    type: { type: string };
    coordinates: [number, number];
    country: string;
  };
  isDeleted: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantModel extends Model<RestaurantDocument> {
  findByEvent(event: EventData): Promise<RestaurantDocument | null>;
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
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ unique: true, index: true })
  slug: string;

  @Prop({ required: true, unique: true, index: true })
  taxId: string;

  @Prop({ type: [String] })
  cuisine: string[];

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  address: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    country: { type: String },
  })
  location: {
    type: { type: string };
    coordinates: [number, number]; // [0] is longitude, [1] is latitude
    country: string;
  };

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.set('versionKey', 'version');
RestaurantSchema.plugin(updateIfCurrentPlugin);

RestaurantSchema.statics.findByEvent = async function (event: EventData) {
  const { id, version } = event;
  return this.findOne({ _id: id, version: version - 1 });
};
