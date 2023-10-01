import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// JWT
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

// DTO
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtMailService: JwtMailService,
  ) {}

  // find user
  async getUser(user: UserDetails): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findById(user.id);
    if (!foundUser) throw new NotFoundException('Account not found');
    if (!foundUser.isVerified)
      throw new UnauthorizedException('Account not verified');
    return foundUser;
  }

  // find user
  async findAuthUser(authDto: AuthDto): Promise<UserDetails> {
    const { authId } = authDto;
    const foundUser: UserDocument = await this.userModel.findOne({ authId });
    if (!foundUser) throw new NotFoundException('Account not found');
    if (!foundUser.isVerified)
      throw new UnauthorizedException('Account not verified');
    return { id: foundUser.id, email: foundUser.email };
  }

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<void> {
    const newUser: UserDocument = new this.userModel(user);
    await newUser.save();
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

    return 'Account Verified Successfully';
  }
}
