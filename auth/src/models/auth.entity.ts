import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { hashPassword } from '../utils/password.utils';

export interface AuthDocument extends HydratedDocument<Auth> {
  id: string;
  username: string;
  phone: string;
  password: string;
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
  timestamps: true,
})
export class Auth {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// Version
AuthSchema.set('versionKey', 'version');
AuthSchema.plugin(updateIfCurrentPlugin);

// Hash the password whenever document gets saved
AuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});
