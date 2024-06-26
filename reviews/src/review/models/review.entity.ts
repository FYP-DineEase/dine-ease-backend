import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Sentiments } from '@dine_ease/common';
import runPythonScript from '../sentiments/get-sentiment';

export interface ReviewDocument extends HydratedDocument<Review> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  content: string;
  rating: number;
  sentiment: Sentiments;
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
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ enum: Sentiments })
  sentiment: Sentiments;

  @Prop({ required: false, type: [String] })
  images: string[];

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'Vote' }])
  votes: Types.ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Version
ReviewSchema.set('versionKey', 'version');

// Execute before saving
ReviewSchema.pre('save', async function (done) {
  const update = ['rating', 'content', 'isDeleted'];

  // update version
  if (!this.isNew && update.some((value) => this.isModified(value))) {
    this.increment();
  }

  // for sentiment analysis
  if (this.isNew || this.isModified('content')) {
    this.sentiment = await runPythonScript(this.content);
  }

  done();
});
