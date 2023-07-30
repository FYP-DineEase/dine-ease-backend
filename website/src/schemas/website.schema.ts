import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WebsiteDocument = HydratedDocument<Website>;

@Schema()
export class Website {
  @Prop({ required: true, unique: true })
  websiteName: string;

  @Prop({ required: true })
  userId: string;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);

// Remove the password property from the returned user object
WebsiteSchema.methods.toJSON = function () {
  const website = this.toObject();
  website.id = website._id.toString();
  delete website._id;
  return website;
};
