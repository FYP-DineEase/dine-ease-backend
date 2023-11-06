import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserRoles } from '@dine_ease/common';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  authId: Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRoles;
  avatar: string;
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
  email: string;

  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ coordinates: '2dsphere' });

// Version
UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

// Virtual methods
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
