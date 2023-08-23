import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { AllWebsiteStatus, AllWebsiteStatusEnum } from '@mujtaba-web/common';

export interface WebsiteDocument extends HydratedDocument<Website> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  websiteId: Types.ObjectId;
  websiteName: string;
  status: AllWebsiteStatusEnum;
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
export class Website {
  @Prop({ required: true, unique: true, index: true })
  websiteId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  websiteName: string;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: AllWebsiteStatus,
  })
  status: AllWebsiteStatusEnum;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

// Version
WebsiteSchema.set('versionKey', 'version');
WebsiteSchema.plugin(updateIfCurrentPlugin);
