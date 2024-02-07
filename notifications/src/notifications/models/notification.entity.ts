import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationCategory } from '@dine_ease/common';

export interface NotificationDocument extends HydratedDocument<Notification> {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  slug: string;
  category: NotificationCategory;
  content: string;
  message: string;
  isRead: boolean;
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
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationCategory })
  category: NotificationCategory;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Virtual methods
// NotificationSchema.virtual('content').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });
