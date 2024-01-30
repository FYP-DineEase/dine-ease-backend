import { IsEnum } from 'class-validator';
import { MapThemes } from 'src/enums/theme.enum';

export class MapThemeDto {
  @IsEnum(MapThemes)
  theme: MapThemes;
}
