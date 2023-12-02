import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'src/enums/menu-categories.enum';

export interface MenuDocument extends HydratedDocument<MenuItem> {
  id: Types.ObjectId;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  order: number;
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
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop()
  image?: string;

  @Prop({ required: true, enum: Category })
  category: Category;

  @Prop()
  order: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
