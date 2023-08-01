import { IsString, Matches, Length } from 'class-validator';

export class WebsiteNameDto {
  @IsString()
  @Length(3, 20)
  @Matches(/^(?=(.*[a-zA-Z]){3})[a-zA-Z0-9_-]+$/, {
    message:
      'Name should contain can only contain atleast 3 letters, can contain numbers, underscore (_), or hyphen (-), no spaces',
  })
  name: string;
}
