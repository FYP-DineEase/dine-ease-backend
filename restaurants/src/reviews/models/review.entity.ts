import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { EventData, Sentiments } from '@dine_ease/common';

export interface ReviewDocument extends HydratedDocument<Review> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  content: string;
  rating: number;
  sentiment: Sentiments;
  isDeleted: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewModel extends Model<ReviewDocument> {
  findByEvent(event: EventData): Promise<ReviewDocument | null>;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
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

  @Prop({ required: true, enum: Sentiments })
  sentiment: Sentiments;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.set('versionKey', 'version');
ReviewSchema.plugin(updateIfCurrentPlugin);

ReviewSchema.statics.findByEvent = async function (event: EventData) {
  const { id, version } = event;
  return this.findOne({ _id: id, version: version - 1 });
};
