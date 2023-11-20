import { IsLatitude, IsLongitude } from 'class-validator';

export class UpdateLocationDto {
  @IsLatitude()
  latitude: string;

  @IsLongitude()
  longitude: string;
}
