import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashPassword } from '../utils/password.utils';

export interface AuthDocument extends HydratedDocument<Auth> {
  id: Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
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
})
export class Auth {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// Password Hashing
AuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});
