import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { AllUserRoles, RoleTypes } from '@dine_ease/common';
import { nanoid } from 'nanoid';
import { EventData } from 'src/interfaces/version.interface';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  slug: string;
  authId: Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: AllUserRoles;
  avatar: string;
  location: {
    type: { type: string };
    coordinates: [number, number];
  };
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
    virtuals: true,
  },
  timestamps: true,
})
export class User {
  @Prop({ type: Types.ObjectId, required: true })
  authId: Types.ObjectId;

  @Prop({ default: nanoid(10) })
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
  })
  location: {
    type: { type: string };
    coordinates: [number, number]; // [0] is longitude, [1] is latitude
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Version
UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

// Virtual methods
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.statics.findByEvent = function (event: EventData) {
  const { userId: _id, version } = event;
  return this.findOne({ _id, version: version - 1 });
};
