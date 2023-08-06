import { IsString, IsEnum } from 'class-validator';
import WebsiteStatus from 'src/utils/enums/website-status.enum';

export class WebsiteStatusDto {
  @IsString()
  @IsEnum(WebsiteStatus)
  status: WebsiteStatus;
}
