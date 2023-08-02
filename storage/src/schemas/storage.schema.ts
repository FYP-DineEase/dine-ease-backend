import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StorageTypes } from 'src/utils/enums/storage-types.enum';

export type StorageDocument = HydratedDocument<Storage>;

@Schema()
export class Storage {
  @Prop({ required: true, unique: true })
  StorageName: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: Object.values(StorageTypes) })
  type: StorageTypes;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);

StorageSchema.methods.toJSON = function () {
  const storage = this.toObject();
  storage.id = storage._id.toString();
  delete storage._id;
  return storage;
};
