import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PlaylistStatus } from 'src/utils/enums/playlist-status.enum';

export interface PlaylistDocument extends HydratedDocument<Playlist> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  websiteId: Types.ObjectId;
  title: string;
  price: number;
  sections: Types.ObjectId[];
  isDeleted: false;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
      return ret;
    },
  },
})
export class Playlist {
  @Prop({ required: true })
  websiteId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  picture: string;

  @Prop({
    required: true,
    enum: PlaylistStatus,
    default: PlaylistStatus.ACTIVE,
  })
  status: PlaylistStatus;

  @Prop([{ type: Types.ObjectId, ref: 'Section' }])
  sections: Types.ObjectId[];

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
