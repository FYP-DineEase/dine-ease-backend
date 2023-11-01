import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { VoteTypes } from '../utils/enums/votes.enum';

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
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  reviewId: Types.ObjectId;

  @Prop({ required: true, enum: VoteTypes })
  type: VoteTypes;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

// Version
VoteSchema.set('versionKey', 'version');
VoteSchema.plugin(updateIfCurrentPlugin);
