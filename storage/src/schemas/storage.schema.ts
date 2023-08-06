import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { StorageTypes } from 'src/utils/enums/storage-types.enum';

export interface StorageDocument extends HydratedDocument<Storage> {
  id: string;
  userId: string;
  type: StorageTypes;
  url: string;
}

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Storage {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: Object.values(StorageTypes) })
  type: StorageTypes;

  @Prop({ required: true })
  url: string;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);

// Version
WebsiteSchema.set('versionKey', 'version');
WebsiteSchema.plugin(updateIfCurrentPlugin);
