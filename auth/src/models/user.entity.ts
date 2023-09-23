import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { hashPassword } from '../utils/password.utils';

export interface UserDocument extends HydratedDocument<User> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  isVerified: boolean;
  fullName: string;
  version: number;
}

@Schema({
  toJSON: { virtuals: true },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Version
UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

// Virtual methods
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash the password whenever document gets saved
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});
