import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MenuDocument, MenuItemSchema } from 'src/menu/models/menu.entity';
import { Status, StatusTypes } from '@dine_ease/common';
import slugify from 'slugify';

export interface RestaurantDocument extends HydratedDocument<Restaurant> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  slug: string;
  categories: string[];
  cover: string;
  images: string[];
  address: string;
  location: {
    type: { type: string };
    coordinates: [number, number];
    country: string;
  };
  taxId: string;
  phoneNumber: string;
  status: Status;
  menu: MenuDocument[];
  featuredTill: Date;
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

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, index: true })
  slug: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  count: number;

  @Prop({ required: true, type: [String] })
  categories: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true, index: true })
  taxId: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    required: true,
    enum: StatusTypes,
    default: StatusTypes.PENDING,
  })
  status: Status;

  @Prop()
  cover: string;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    country: { type: String, required: true },
  })
  location: {
    type: { type: string };
    coordinates: [number, number]; // [0] is longitude, [1] is latitude
    country: string;
  };

  @Prop({ type: [MenuItemSchema], default: [] })
  menu: MenuDocument[];

  @Prop()
  featuredTill: Date;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Version
RestaurantSchema.set('versionKey', 'version');

// Execute before saving
RestaurantSchema.pre('save', async function (done) {
  const update = [
    'name',
    'taxId',
    'categories',
    'address',
    'images',
    'cover',
    'location',
    'isDeleted',
  ];

  // update version
  if (
    this.status === StatusTypes.APPROVED &&
    update.some((value) => this.isModified(value))
  ) {
    this.increment();
  }

  // generates slug
  if (this.isModified('name')) {
    let slug = slugify(this.name, { lower: true, strict: true });

    const regex = new RegExp(slug, 'i');
    const data = await this.model(Restaurant.name).find({
      slug: { $regex: regex },
    });

    if (data.length > 0) slug = `${slug}-${data.length}`;
    this.slug = slug;
  }

  done();
});
