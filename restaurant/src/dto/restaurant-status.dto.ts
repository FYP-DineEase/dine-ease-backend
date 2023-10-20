import { ApprovalStatus } from '@dine_ease/common';
import { IsString, IsNotEmpty, IsEnum, ValidateIf } from 'class-validator';

export class RestaurantStatusDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ValidateIf((object) => object.status === ApprovalStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  remarks: string;
}
