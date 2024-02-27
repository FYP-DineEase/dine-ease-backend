import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { PrimaryDetailsDto } from 'src/restaurants/dto/primary-details.dto';

export class CreateReqeustDto extends PrimaryDetailsDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsMongoId()
  restaurantId: Types.ObjectId;
}
