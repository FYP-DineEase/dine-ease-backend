import { ApprovalStatus } from '@dine_ease/common';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  Length,
} from 'class-validator';

export class RestaurantStatusDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ValidateIf((object) => object.status === ApprovalStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  remarks: string;
}
