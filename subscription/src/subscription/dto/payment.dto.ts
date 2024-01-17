import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PaymentDto {
  @IsNumber({}, { message: 'Charges must be a number' })
  charges: number;

  // @IsString()
  // @IsNotEmpty()
  // token: string;
}
