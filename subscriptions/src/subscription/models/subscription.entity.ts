import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface SubscriptionDocument extends HydratedDocument<Subscription> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  stripeId: Types.ObjectId;
  planId: Types.ObjectId;
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
export class Subscription {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, unique: true, index: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  stripeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  planId: Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
