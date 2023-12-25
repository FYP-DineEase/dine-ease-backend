import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MapThemes } from 'src/enums/theme.enum';
import { nanoid } from 'nanoid';

export interface MapDocument extends HydratedDocument<Map> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  slug: string;
  restaurants: Types.ObjectId[];
  theme: MapThemes;
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
export class Map {
  @Prop({ type: Types.ObjectId, required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ default: nanoid(10), unique: true, index: true })
  slug: string;

  @Prop([{ type: Types.ObjectId, ref: 'Restaurant' }])
  restaurants: Types.ObjectId[];

  @Prop({ required: true, enum: MapThemes, default: MapThemes.DARK })
  theme: MapThemes;
}

export const MapSchema = SchemaFactory.createForClass(Map);
