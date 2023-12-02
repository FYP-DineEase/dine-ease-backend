import { IsCoordinates } from 'src/decorators/coordinates.decorator';

export class UpdateLocationDto {
  @IsCoordinates()
  location: {
    coordinates: [number, number];
  };
}
