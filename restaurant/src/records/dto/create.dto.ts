import {
  IsMongoId,
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ApprovalStatus } from '@dine_ease/common';
import { RecordType } from 'src/enums/record.enum';

export class CreateRecordDto {
  @IsMongoId()
  adminId: string;

  @IsMongoId()
  restaurantId: string;

  @IsEnum(RecordType)
  type: RecordType;

  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ValidateIf((object) => object.status === ApprovalStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  remarks: string;
}
