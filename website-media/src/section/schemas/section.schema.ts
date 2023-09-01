import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface SectionDocument extends HydratedDocument<Section> {
  playlistId: Types.ObjectId;
  title: string;
  content: Types.ObjectId[];
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Section {
  @Prop({ type: Types.ObjectId, ref: 'Playlist', required: true })
  playlistId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop([{ type: Types.ObjectId, ref: 'Content' }])
  content: Types.ObjectId[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
