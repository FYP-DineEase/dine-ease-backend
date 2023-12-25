import { Types } from 'mongoose';

export interface EventData {
  userId: Types.ObjectId;
  version: number;
}
