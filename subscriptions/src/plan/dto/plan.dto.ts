import { IsNumber, Min, Max, IsNotEmpty, IsString } from 'class-validator';

export class PlanDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @Min(10)
  @Max(100)
  charges: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  durationInMonths: number;
}
