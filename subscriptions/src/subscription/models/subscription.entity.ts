import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface SubscriptionDocument extends HydratedDocument<Subscription> {
  id: Types.ObjectId;
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
  @Prop({ type: Types.ObjectId, required: true, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  stripeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Plan' })
  planId: Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
