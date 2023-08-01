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

// utils
import { comparePasswords } from './utils/password.utils';
import { UserDetails } from '@mujtaba-web/common';

// event
import { NatsWrapper } from '@mujtaba-web/common';
import { AccountCreatedPublisher } from './events/publishers/account-created-publisher';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly natsWrapper: NatsWrapper,
  ) {}

  // login user
  async login(user: UserCredentialsDto): Promise<string> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .select('+password');

    console.log(foundUser);

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
    const token = this.jwtService.sign(payload);

    return token;
  }

  // register unverified account
  async registerUnverified(user: RegisterUserDto): Promise<string> {
    const existingUser: User = await this.userModel.findOne({
      email: user.email,
    });
    if (existingUser) throw new BadRequestException('Account already taken');

    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();

    const payload = { id: savedUser.id };
    const token = this.jwtService.sign(payload);

    new AccountCreatedPublisher(this.natsWrapper.client).publish({
      name: savedUser.name,
      email: savedUser.email,
      token: token,
    });

    return `Confirmation email sent to ${savedUser.email}`;
  }

  // register verified account
  async registerVerified(user: VerifyUserDto): Promise<string> {
    const userDetails: UserDetails = await this.jwtService.verifyAsync(
      user.token,
    );

    const foundUser = await this.userModel.findById(userDetails.id);
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
    const token = this.jwtService.sign(payload);
    return token;
  }

  // register unverified account
  async deleteUnverifiedUser(user: VerifyUserDto): Promise<string> {
    const userDetails: UserDetails = await this.jwtService.verifyAsync(
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
