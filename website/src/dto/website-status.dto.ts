import { IsString, IsEnum } from 'class-validator';
import { WebsiteStatus } from '@mujtaba-web/common';

export class WebsiteStatusDto {
  @IsString()
  @IsEnum(WebsiteStatus)
  status: WebsiteStatus;
}
