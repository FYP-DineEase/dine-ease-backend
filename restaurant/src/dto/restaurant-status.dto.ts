import { IsString, IsNotEmpty, IsEnum, ValidateIf } from 'class-validator';
import { ApprovalStatus } from '../enums/restaurant-status.enum';

export class RestaurantStatusDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ValidateIf((object) => object.status === ApprovalStatus.REJECTED)
  @IsString()
  @IsNotEmpty()
  remarks: string;
}
