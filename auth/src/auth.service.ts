import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  AccountCreatedEvent,
  AccountVerifiedEvent,
  Subjects,
} from '@dine_ease/common';

// JWT
import { JwtMailService, EmailTokenTypes } from '@dine_ease/common';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './models/auth.entity';

// DTO
import { EmailDto } from './dto/email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

// Utils
import { comparePasswords } from './utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly publisher: Publisher,
    private readonly jwtMailService: JwtMailService,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  // check email uniqueness
  async checkEmailExists(emailDto: EmailDto): Promise<boolean> {
    const { email } = emailDto;
    const existingUser: AuthDocument = await this.authModel.findOne({ email });
    return !!existingUser;
  }

  // verify account
  async verifyAccount(emailToken: string): Promise<string> {
    const tokenEmail: string = await this.jwtMailService.decodeToken(
      emailToken,
      EmailTokenTypes.ACCOUNT_VERIFY,
    );

    const foundUser: AuthDocument = await this.authModel.findOne({
      email: tokenEmail,
    });

    if (!foundUser) throw new NotFoundException('User not found');
    if (foundUser.isVerified)
      throw new ForbiddenException('Account is already verified');

    foundUser.set({ isVerified: true });
    await foundUser.save();

    const event: AccountVerifiedEvent = {
      authId: foundUser.id,
      email: foundUser.email,
    };

    this.publisher.emit<string, AccountVerifiedEvent>(
      Subjects.AccountVerified,
      event,
    );

    return 'Account Verified Successfully';
  }

  // login user
  async login(loginUserDto: LoginUserDto): Promise<Types.ObjectId> {
    const foundUser: AuthDocument = await this.authModel
      .findOne({ email: loginUserDto.email })
      .select('+password');
    if (!foundUser) throw new NotFoundException('User not found');

    const passMatches: boolean = await comparePasswords(
      loginUserDto.password,
      foundUser.password,
    );

    if (!passMatches) throw new UnauthorizedException('Invalid Credentials');
    if (!foundUser.isVerified)
      throw new ForbiddenException('User is not verified');

    return foundUser.id;
  }

  // register unverified account
  async registerUnverified(registerUserDto: RegisterUserDto): Promise<string> {
    const { firstName, lastName, role, email, password } = registerUserDto;

    const existingUser: AuthDocument = await this.authModel.findOne({ email });
    if (existingUser) throw new BadRequestException('Email is taken');

    const newUser: AuthDocument = await this.authModel.create({
      email,
      password,
    });

    const event: AccountCreatedEvent = {
      authId: newUser.id,
      firstName,
      lastName,
      email,
      role,
    };

    this.publisher.emit<string, AccountCreatedEvent>(
      Subjects.AccountCreated,
      event,
    );

    return 'Account Created Successfully';
  }

  // update password
  async updatePassword(
    token: string,
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    const { password } = forgotPasswordDto;

    const email: string = await this.jwtMailService.decodeToken(
      token,
      EmailTokenTypes.UPDATE_PASSWORD,
    );

    const foundUser: AuthDocument = await this.authModel.findOne({ email });
    if (!foundUser) throw new NotFoundException('User not found');

    foundUser.set({ password });
    await foundUser.save();

    return `Password Updated Successfully`;
  }
}
