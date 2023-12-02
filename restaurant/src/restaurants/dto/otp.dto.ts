import { IsNumberString, Length } from 'class-validator';

export class OtpDto {
  @IsNumberString({}, { message: 'OTP must be a number' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string;
}
