import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './vote.entity';

export interface PlanDocument extends HydratedDocument<Plan> {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  votes: Vote[];
  restaurants: Types.ObjectId[];
  invitees: string[];
  date: Date;
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
export class Plan {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  invitees: string[];

  @Prop({ required: true })
  date: Date;

  @Prop([{ type: Types.ObjectId, required: true, ref: 'Restaurant' }])
  restaurants: Types.ObjectId[];

  @Prop({ type: [VoteSchema], default: [] })
  votes: Vote[];
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
