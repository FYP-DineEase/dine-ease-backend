import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface ReviewDocument extends HydratedDocument<Review> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  content: string;
  rating: number;
  images: string[];
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
export class Review {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: false, type: [String] })
  images: string[];

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Version
ReviewSchema.set('versionKey', 'version');
ReviewSchema.plugin(updateIfCurrentPlugin);
