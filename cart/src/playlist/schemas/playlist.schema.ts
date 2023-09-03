import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { HydratedDocument, Types } from 'mongoose';

export interface PlaylistDocument extends HydratedDocument<Playlist> {
  id: Types.ObjectId;
  websiteId: Types.ObjectId;
  playlistId: Types.ObjectId;
  title: string;
  price: number;
  picture: string;
  version: number;
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
export class Playlist {
  @Prop({ required: true })
  websiteId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  playlistId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  picture: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

// Version
PlaylistSchema.set('versionKey', 'version');
PlaylistSchema.plugin(updateIfCurrentPlugin);
