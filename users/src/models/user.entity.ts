import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AllUserRoles, RoleTypes } from '@dine_ease/common';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  slug: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: AllUserRoles;
  avatar: string;
  cover: string;
  description: string;
  mapSlug: string;
  location: {
    type: { type: string };
    coordinates: [number, number];
    country: string;
  };
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

  @Prop()
  mapSlug: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Version
UserSchema.set('versionKey', 'version');

// Execute before saving
UserSchema.pre('save', function (done) {
  const update = ['email', 'firstName', 'lastName', 'avatar'];

  // update version
  if (update.some((value) => this.isModified(value))) {
    this.increment();
  }

  done();
});

// Virtual methods
UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
