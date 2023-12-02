import { IsMongoId } from 'class-validator';
import { PrimaryDetailsDto } from 'src/restaurants/dto/primary-details.dto';

export class CreateReqeustDto extends PrimaryDetailsDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  restaurantId: string;
}
