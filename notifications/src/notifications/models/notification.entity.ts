import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventData, NotificationCategory } from '@dine_ease/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface NotificationDocument extends HydratedDocument<Notification> {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  slug: string;
  category: NotificationCategory;
  message: string;
  isRead: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationModel extends Model<NotificationDocument> {
  findByEvent(event: EventData): Promise<NotificationDocument | null>;
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

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('versionKey', 'version');
NotificationSchema.plugin(updateIfCurrentPlugin);

NotificationSchema.statics.findByEvent = async function (event: EventData) {
  const { id, version } = event;
  return this.findOne({ _id: id, version: version - 1 });
};
