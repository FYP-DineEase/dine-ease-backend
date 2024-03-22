import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { EventData } from '@dine_ease/common';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  slug: string;
  name: string;
  email: string;
  avatar: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<UserDocument> {
  findByEvent(event: EventData): Promise<UserDocument | null>;
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
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

UserSchema.statics.findByEvent = async function (event: EventData) {
  const { id, version } = event;
  return this.findOne({ _id: id, version: version - 1 });
};
