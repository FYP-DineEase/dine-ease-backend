import { IsEnum } from 'class-validator';
import { VoteTypes } from '../utils/enums/votes.enum';

export class VoteDto {
  @IsEnum(VoteTypes)
  type: VoteTypes;
}
