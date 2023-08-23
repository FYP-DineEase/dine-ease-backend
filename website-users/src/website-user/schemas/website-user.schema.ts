import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface WebsiteUserDocument extends HydratedDocument<WebsiteUser> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  websiteId: Types.ObjectId;
  email: string;
  newsletter: boolean;
  version: number;
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
export class WebsiteUser {
  @Prop({ required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true, index: true })
  websiteId: Types.ObjectId;

  @Prop({ default: false })
  newsLetter: boolean;
}

export const WebsiteUserSchema = SchemaFactory.createForClass(WebsiteUser);

// Version
WebsiteUserSchema.set('versionKey', 'version');
WebsiteUserSchema.plugin(updateIfCurrentPlugin);
