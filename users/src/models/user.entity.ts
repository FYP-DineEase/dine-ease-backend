import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllUserRoles, RoleTypes } from '@dine_ease/common';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  slug: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: AllUserRoles;
  avatar: string;
  cover: string;
  description: string;
  location: {
    type: { type: string };
    coordinates: [number, number];
    country: string;
  };
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
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, enum: RoleTypes })
  role: AllUserRoles;

  @Prop()
  avatar: string;

  @Prop()
  cover: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    country: { type: String },
  })
  location: {
    type: { type: string };
    coordinates: [number, number]; // [0] is longitude, [1] is latitude
    country: string;
  };

  @Prop()
  description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual methods
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
