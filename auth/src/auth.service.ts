import { Injectable, BadRequestException } from '@nestjs/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { AccountCreatedEvent, Subjects } from '@dine_ease/common';

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
    const { firstName, lastName, role, username, phone, password } = user;

    const existingUser: AuthDocument | null = await this.authModel.findOne({
      $or: [{ phone }, { username }],
    });
    if (existingUser) throw new BadRequestException('Account already taken');

    const newUser = new this.authModel({ username, password, phone });
    await newUser.save();

    const event: AccountCreatedEvent = {
      authId: newUser.id,
      firstName,
      lastName,
      role,
      username,
      phone,
    };

    this.publisher.emit<string, AccountCreatedEvent>(
      Subjects.AccountCreated,
      event,
    );

    return 'Account Created Successfully';
  }
}
