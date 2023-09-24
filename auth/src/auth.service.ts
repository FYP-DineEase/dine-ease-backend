import { Injectable, BadRequestException } from '@nestjs/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './models/auth.entity';

// DTO
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private publisher: Publisher,
  ) {}

  // register unverified account
  async registerUnverified(user: RegisterUserDto): Promise<string> {
    const { username, phone, password } = user;

    const existingUser: AuthDocument = await this.authModel.findOne({ phone });
    if (existingUser) throw new BadRequestException('Account already taken');

    const newUser = new this.authModel({
      username,
      password,
      phone,
    });
    await newUser.save();

    // const event: AccountCreatedEvent = {

    // }

    // this.publisher
    //   .emit<string, AccountCreatedEvent>(Subjects.WebsiteCreated, event)
    //   .subscribe(() =>
    //     console.log('Event published to subject: ', Subjects.AccountCreated),
    //   );

    return 'Account Created Successfully';
  }
}
