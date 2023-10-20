import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApprovalStatus } from '@dine_ease/common';

export interface ApprovalDocument extends HydratedDocument<RestaurantApproval> {
  id: Types.ObjectId;
  adminId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  status: ApprovalStatus;
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
export class RestaurantApproval {
  @Prop({ type: Types.ObjectId, required: true })
  adminId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, enum: ApprovalStatus })
  status: ApprovalStatus;

  @Prop()
  remarks: string;
}

export const RestaurantApprovalSchema =
  SchemaFactory.createForClass(RestaurantApproval);
