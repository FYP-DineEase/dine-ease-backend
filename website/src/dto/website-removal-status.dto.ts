import { IsString, IsEnum } from 'class-validator';
import { WebsiteRemovalStatus } from '@mujtaba-web/common';

export class WebsiteRemovalStatusDto {
  @IsString()
  @IsEnum(WebsiteRemovalStatus)
  status: WebsiteRemovalStatus;
}
