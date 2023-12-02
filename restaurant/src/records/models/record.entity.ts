import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApprovalStatus } from '@dine_ease/common';
import { RecordType } from 'src/enums/record.enum';

export interface RecordDocument extends HydratedDocument<Record> {
  id: Types.ObjectId;
  adminId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  type: RecordType;
  status: ApprovalStatus;
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
export class Record {
  @Prop({ type: Types.ObjectId, required: true })
  adminId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, enum: RecordType })
  type: RecordType;

  @Prop({ required: true, enum: ApprovalStatus })
  status: ApprovalStatus;

  @Prop()
  remarks: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
