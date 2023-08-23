import { IsBoolean } from 'class-validator';

export class NewsletterDto {
  @IsBoolean()
  newsLetter: boolean;
}
