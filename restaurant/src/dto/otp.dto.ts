import { IsNumber, Min, Max } from 'class-validator';

export class OtpDto {
  @IsNumber({}, { message: 'otp must be a number' })
  @Min(100000, { message: 'otp must be at least 6 digit' })
  @Max(999999, { message: 'otp must not exceed 6 digit' })
  otp: number;
}
