import { Injectable } from '@nestjs/common';
import { AccountCreatedEvent } from '@dine_ease/common';
import { TwilioService } from './services/twilio.service';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly twilioService: TwilioService,
  ) {}

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<string> {
    const newUser = new this.userModel(user);
    await newUser.save();
    // await this.twilioService.sendOTP(user.phone);

    const OTP = await this.twilioService.generateOTP();
    return 'Account Created Successfully';
  }

  // verify account
  async registerVerified(): Promise<string> {
    return 'Account Verified Successfully';
  }
}
