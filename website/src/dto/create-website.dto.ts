import { IsString, Matches, Length } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Name can only contain letters, numbers, underscore (_), or hyphen (-)',
  })
  name: string;
}
