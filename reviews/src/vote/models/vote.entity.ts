import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { VoteTypes } from 'src/enums/votes.enum';

export interface VoteDocument extends HydratedDocument<Vote> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  reviewId: Types.ObjectId;
  type: VoteTypes;
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
export class Vote {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Review' })
  reviewId: Types.ObjectId;

  @Prop({ required: true, enum: VoteTypes })
  type: VoteTypes;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
