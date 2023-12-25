import { IsEnum } from 'class-validator';
import { VoteTypes } from 'src/enums/votes.enum';

export class VoteDto {
  @IsEnum(VoteTypes)
  type: VoteTypes;
}
