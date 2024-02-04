import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = new Twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async generateOTP(length = 6): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp.padStart(length, '0');
  }

  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      const otp = await this.generateOTP();
      // await this.twilioClient.messages.create({
      //   to: `+${phoneNumber}`,
      //   from: this.configService.get<string>('TWILIO_PHONE_NO'),
      //   body: `DineEase OTP: ${otp}`,
      // });
      return otp;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
