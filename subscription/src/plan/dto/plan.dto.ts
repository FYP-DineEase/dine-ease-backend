import { IsNumber, Min, Max } from 'class-validator';

export class PlanDto {
  @IsNumber()
  @Min(10)
  @Max(100)
  charges: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  durationInMonths: number;
}
