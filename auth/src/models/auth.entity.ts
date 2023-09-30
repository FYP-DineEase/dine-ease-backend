import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { hashPassword } from '../utils/password.utils';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// Version
AuthSchema.set('versionKey', 'version');
AuthSchema.plugin(updateIfCurrentPlugin);

// Password Hashing
AuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});
