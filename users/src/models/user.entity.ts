import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserRoles } from '@dine_ease/common';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  authId: Types.ObjectId;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  role: UserRoles;
  isVerified: boolean;
  version: number;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  @Prop({ type: Types.ObjectId, required: true })
  authId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  phone: string;

  @Prop()
  avatar: string;

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
