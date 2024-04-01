import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class PlanDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  invitees: string[];

  @IsDateString()
  date: Date;

  @IsMongoId()
  restaurant: Types.ObjectId;
}
