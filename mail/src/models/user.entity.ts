import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
