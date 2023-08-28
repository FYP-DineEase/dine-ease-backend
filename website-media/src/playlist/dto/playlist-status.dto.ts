import { IsString, IsEnum } from 'class-validator';
import { PlaylistStatus } from 'src/utils/enums/playlist-status.enum';

export class PlaylistStatusDto {
  @IsString()
  @IsEnum(PlaylistStatus)
  status: PlaylistStatus;
}
