import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

// JWT
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth/jwt-payload.interface';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';

// utils
import { comparePasswords } from './utils/password.utils';

// event
import { NatsWrapper } from './nats/nats.wrapper';
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

    if (!foundUser) throw new NotFoundException('User not found');

    const passMatches = await comparePasswords(
      user.password,
      foundUser.password,
    );
    if (!passMatches) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { id: foundUser.id, name: foundUser.name };
    const token = this.jwtService.sign(payload);

    return token;
  }

  // register user
  async register(user: RegisterUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) throw new BadRequestException('Account already taken');

    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();

    new AccountCreatedPublisher(this.natsWrapper.client).publish({
      name: savedUser.name,
      email: savedUser.email,
    });

    return savedUser;
  }
}
