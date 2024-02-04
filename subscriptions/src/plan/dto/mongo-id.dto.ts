import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class PlanIdDto {
  @IsMongoId()
  planId: Types.ObjectId;
}
