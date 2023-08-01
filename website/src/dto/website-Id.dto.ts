import { IsMongoId } from 'class-validator';

export class WebsiteIdDto {
  @IsMongoId()
  id: string;
}
