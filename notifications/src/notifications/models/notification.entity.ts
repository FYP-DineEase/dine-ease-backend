import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import {
  EventData,
  NotificationCategory,
  NotificationType,
} from '@dine_ease/common';
import { UserDocument } from 'src/user/models/user.entity';

export interface NotificationDocument extends HydratedDocument<Notification> {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  slug: string;
  category: NotificationCategory;
  message: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
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
      delete ret.message;
      delete ret.isDeleted;
      if (ret.category === NotificationCategory.System) {
        delete ret.senderId;
      }
      return ret;
    },
    virtuals: true,
  },
  timestamps: true,
})
export class Notification {
  @Prop({ type: Types.ObjectId, required: true })
  uid: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationCategory })
  category: NotificationCategory;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('versionKey', 'version');
NotificationSchema.plugin(updateIfCurrentPlugin);

NotificationSchema.statics.findByEvent = async function (event: EventData) {
  const { id, version } = event;
  return this.findOne({ _id: id, version: version - 1 });
};

// Virtual methods
NotificationSchema.virtual('content').get(function () {
  let content: string;

  // just a check to avoid TS error
  if (this.senderId instanceof Types.ObjectId) {
    console.error('senderId is not populated');
  } else {
    const senderName = (this.senderId as UserDocument).name;

    if (this.category === NotificationCategory.System) {
      content = `An admin ${this.message}`;
      delete this.senderId;
    } else {
      content = `${senderName} ${this.message}`;
    }
  }

  return content;
});
