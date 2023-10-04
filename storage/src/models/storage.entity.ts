import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StorageTypes } from 'src/utils/enums/storage-type.enum';

export interface StorageDocument extends HydratedDocument<Storage> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  type: StorageTypes;
  image: string;
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
export class Storage {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: StorageTypes })
  type: StorageTypes;

  @Prop({ required: true })
  image: string;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
