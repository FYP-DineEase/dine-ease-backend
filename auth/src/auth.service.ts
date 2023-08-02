import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UserEmailDto } from './dto/user-email.dto';
import { UserPasswordDto } from './dto/user-password.dto';

// utils
import { comparePasswords } from './utils/password.utils';
import { UserDetails } from '@mujtaba-web/common';
import { EmailTokenTypes } from './utils/enums/email-token.enum';

// event
import { NatsWrapper } from '@mujtaba-web/common';
import { AccountCreatedPublisher } from './events/publishers/account-created-publisher';
import { JwtMailService } from './jwt/jwt-mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtAuthService: JwtService,
    private readonly jwtMailService: JwtMailService,
    private readonly natsWrapper: NatsWrapper,
  ) {}

  // email confirmation
  async emailConfirmation(user: UserEmailDto): Promise<string> {
    const { email } = user;

    const payload = { email };
    const token = this.jwtAuthService.sign(payload);

    new AccountCreatedPublisher(this.natsWrapper.client).publish({
      email,
      token,
    });

    return `Confirmation email sent to ${user.email}`;
  }

  // login user
  async login(user: UserCredentialsDto): Promise<string> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .select('+password');

    if (!foundUser) throw new NotFoundException('User not found');

    if (!foundUser.isVerified)
      throw new BadRequestException('Account not verified');

    const passMatches = await comparePasswords(
      user.password,
      foundUser.password,
    );
    if (!passMatches) throw new UnauthorizedException('Invalid credentials');

    const payload: UserDetails = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      profilePicture: foundUser.profilePicture,
    };
    const token = this.jwtAuthService.sign(payload);

    return token;
  }

  // register unverified account
  async registerUnverified(user: RegisterUserDto): Promise<string> {
    const { name, email, password } = user;

    const existingUser: User = await this.userModel.findOne({ email });
    if (existingUser) throw new BadRequestException('Account already taken');

    const createdUser = new this.userModel({
      name,
      email,
      password,
    });
    const savedUser = await createdUser.save();
    return this.emailConfirmation(savedUser);
  }

  // register verified account
  async registerVerified(user: VerifyUserDto): Promise<string> {
    const userDetails: UserDetails = await this.jwtAuthService.verifyAsync(
      user.token,
    );

    const foundUser = await this.userModel.findOne({
      email: userDetails.email,
    });
    if (!foundUser) throw new NotFoundException('User not found');

    if (foundUser.isVerified)
      throw new BadRequestException('Account is already verified');

    foundUser.set({ isVerified: true });
    await foundUser.save();

    const payload: UserDetails = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      profilePicture: foundUser.profilePicture,
    };
    const token = this.jwtAuthService.sign(payload);
    return token;
  }

  // forgot password
  async forgotPassword(user: UserEmailDto): Promise<string> {
    const { email } = user;
    const token = this.jwtMailService.signToken(
      email,
      EmailTokenTypes.UPDATE_PASSWORD,
      '1d',
    );

    new AccountCreatedPublisher(this.natsWrapper.client).publish({
      email,
      token,
    });

    return `Confirmation email sent to ${user.email}`;
  }

  // update password
  async updatePassword(user: UserPasswordDto): Promise<string> {
    // find user and update password after token valdation
    return `Account Deleted Successfully`;
  }

  // register unverified account
  async deleteUnverifiedUser(user: VerifyUserDto): Promise<string> {
    const userDetails: UserDetails = await this.jwtAuthService.verifyAsync(
      user.token,
    );

    const deletedUser: User = await this.userModel.findOneAndDelete({
      _id: userDetails.id,
      isVerified: false,
    });

    if (!deletedUser)
      throw new BadRequestException('Un-Verified User not found');

    return `Account Deleted Successfully`;
  }
}
