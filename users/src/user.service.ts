import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// JWT
import { JwtService } from '@nestjs/jwt';
import {
  JwtMailService,
  EmailTokenTypes,
  UserDetails,
} from '@dine_ease/common';

// NATS
import { AccountCreatedEvent } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtAuthService: JwtService,
    private readonly jwtMailService: JwtMailService,
  ) {}

  // find user
  async getUser(user: UserDetails): Promise<UserDocument> {
    const existingUser: UserDocument = await this.userModel.findById(user.id);
    if (!existingUser) throw new NotFoundException('Account not found');
    if (!existingUser.isVerified)
      throw new UnauthorizedException('Account not verified');
    return existingUser;
  }

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<string> {
    const newUser: UserDocument = new this.userModel(user);
    await newUser.save();
    return 'Account Created Successfully';
  }

  // verify account
  async verifyAccount(emailToken: string): Promise<string> {
    const tokenEmail: string = await this.jwtMailService.decodeToken(
      emailToken,
      EmailTokenTypes.ACCOUNT_VERIFY,
    );

    const foundUser: UserDocument = await this.userModel.findOne({
      email: tokenEmail,
    });

    if (!foundUser) throw new NotFoundException('User not found');
    if (foundUser.isVerified)
      throw new BadRequestException('Account is verified');

    foundUser.set({ isVerified: true });
    await foundUser.save();

    const { id, email } = foundUser;
    const payload: UserDetails = { id, email };
    const token: string = this.jwtAuthService.sign(payload);
    return token;
  }
}
