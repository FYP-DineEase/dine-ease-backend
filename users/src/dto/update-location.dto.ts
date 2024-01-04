import { IsCoordinates } from 'src/decorators/coordinates.decorator';

export class UpdateLocationDto {
  @IsCoordinates()
  location: {
    country: string;
    coordinates: [number, number];
  };
}
