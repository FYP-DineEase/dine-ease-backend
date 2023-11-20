import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface UserDocument extends HydratedDocument<User> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  image: string;
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
  timestamps: true,
})
export class User {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop()
  avatar: string;

  @Prop()
  cover: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Version
UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);
