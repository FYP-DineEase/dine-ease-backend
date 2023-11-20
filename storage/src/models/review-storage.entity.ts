import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface ReviewDocument extends HydratedDocument<Review> {
  id: Types.ObjectId;
  uploaderId: Types.ObjectId;
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
export class Review {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  reviewId: Types.ObjectId;

  @Prop({ required: true, type: [String] })
  images: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Version
ReviewSchema.set('versionKey', 'version');
ReviewSchema.plugin(updateIfCurrentPlugin);
