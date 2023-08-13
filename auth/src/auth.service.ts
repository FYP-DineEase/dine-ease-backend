import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserTokenDto } from './dto/user-token.dto';
import { UserEmailDto } from './dto/user-email.dto';
import { UserPasswordDto } from './dto/user-password.dto';

// utils
import { JwtMailService } from './jwt/jwt-mail.service';
import { UserDetails } from '@mujtaba-web/common';
import { EmailTokenPayload } from './jwt/jwt-mail.interface';
import { comparePasswords } from './utils/password.utils';
import { EmailTokenTypes } from './utils/enums/email-token.enum';

// event
import { NatsWrapper } from '@mujtaba-web/common';
import { AccountCreatedPublisher } from './events/publishers/account-created-publisher';
import { ForgotPasswordPublisher } from './events/publishers/forgot-password-publisher';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtAuthService: JwtService,
    private readonly jwtMailService: JwtMailService,
    private readonly natsWrapper: NatsWrapper,
  ) {}

  // email confirmation
  emailConfirmation(
    verifyPayload: EmailTokenPayload,
    deletePayload: EmailTokenPayload,
  ): string {
    const verifyToken: string = this.jwtMailService.signToken(verifyPayload);
    const deleteToken: string = this.jwtMailService.signToken(deletePayload);

    new AccountCreatedPublisher(this.natsWrapper.client).publish({
      email: verifyPayload.email,
      verifyToken,
      deleteToken,
    });

    return `Confirmation Email Sent To ${verifyPayload.email}`;
  }

  // login user
  async login(user: UserCredentialsDto): Promise<string> {
    const foundUser: UserDocument = await this.userModel
      .findOne({ email: user.email })
      .select('+password');

    if (!foundUser) throw new NotFoundException('User not found');

    if (!foundUser.isVerified)
      throw new BadRequestException('Account not verified');

    const passMatches: boolean = await comparePasswords(
      user.password.toString(),
      foundUser.password,
    );
    if (!passMatches) throw new UnauthorizedException('Invalid Credentials');

    const { id, fullName, email, profilePicture } = foundUser;
    const payload: UserDetails = { id, fullName, email, profilePicture };
    const token: string = this.jwtAuthService.sign(payload);
    return token;
  }

  // register unverified account
  async registerUnverified(user: RegisterUserDto): Promise<string> {
    const { firstName, lastName, password, email, role, profilePicture } = user;

    const existingUser: UserDocument = await this.userModel.findOne({ email });
    if (existingUser) throw new BadRequestException('Account already taken');

    const createdUser = new this.userModel({
      firstName,
      lastName,
      password,
      email,
      role,
      profilePicture,
    });
    const savedUser: UserDocument = await createdUser.save();

    const payload = { email: savedUser.email, expiresIn: '7d' };
    const verifyPayload: EmailTokenPayload = {
      ...payload,
      tokenType: EmailTokenTypes.ACCOUNT_VERIFY,
    };
    const deletePayload: EmailTokenPayload = {
      ...payload,
      tokenType: EmailTokenTypes.DELETE_VERIFY,
    };

    return this.emailConfirmation(verifyPayload, deletePayload);
  }

  // register verified account
  async registerVerified(user: UserTokenDto): Promise<string> {
    const tokenEmail: string = await this.jwtMailService.decodeToken(
      user.token,
      EmailTokenTypes.ACCOUNT_VERIFY,
    );

    const foundUser: UserDocument = await this.userModel.findOne({
      email: tokenEmail,
    });
    if (!foundUser) throw new NotFoundException('User not found');

    if (foundUser.isVerified)
      throw new BadRequestException('Account is already verified');

    foundUser.set({ isVerified: true });
    await foundUser.save();

    const { id, fullName, email, profilePicture } = foundUser;
    const payload: UserDetails = { id, fullName, email, profilePicture };
    const token = this.jwtAuthService.sign(payload);
    return token;
  }

  // register unverified account
  async deleteUnverifiedUser(user: UserTokenDto): Promise<string> {
    const tokenEmail: string = await this.jwtMailService.decodeToken(
      user.token,
      EmailTokenTypes.DELETE_VERIFY,
    );

    const deletedUser: UserDocument = await this.userModel.findOneAndDelete({
      email: tokenEmail,
      isVerified: false,
    });

    if (!deletedUser) {
      throw new NotFoundException('Un-Verified User not found');
    }

    return `Account Deleted Successfully`;
  }

  // resend verification
  async resentVerification(user: UserEmailDto): Promise<string> {
    const { email } = user;
    const foundUser: UserDocument = await this.userModel.findOne({ email });

    if (!foundUser || foundUser.isVerified) {
      throw new BadRequestException('Invalid User');
    }

    const payload = { email: user.email, expiresIn: '7d' };
    const verifyPayload: EmailTokenPayload = {
      ...payload,
      tokenType: EmailTokenTypes.RESEND_VERIFY,
    };
    const deletePayload: EmailTokenPayload = {
      ...payload,
      tokenType: EmailTokenTypes.DELETE_VERIFY,
    };
    return this.emailConfirmation(verifyPayload, deletePayload);
  }

  // forgot password
  async forgotPassword(user: UserEmailDto): Promise<string> {
    const { email } = user;
    const forgotPassPayload: EmailTokenPayload = {
      email,
      expiresIn: '7d',
      tokenType: EmailTokenTypes.UPDATE_PASSWORD,
    };
    const forgotPassToken: string =
      this.jwtMailService.signToken(forgotPassPayload);

    new ForgotPasswordPublisher(this.natsWrapper.client).publish({
      email,
      token: forgotPassToken,
    });

    return `Password Update Request sent to ${email}`;
  }

  // update password
  async updatePassword(
    userToken: UserTokenDto,
    userPass: UserPasswordDto,
  ): Promise<string> {
    const { password } = userPass;

    const email: string = await this.jwtMailService.decodeToken(
      userToken.token,
      EmailTokenTypes.UPDATE_PASSWORD,
    );

    const foundUser = await this.userModel
      .findOne({ email })
      .select('+password');

    const passMatches: boolean = await comparePasswords(
      password,
      foundUser.password,
    );

    if (passMatches)
      throw new ConflictException('Cannot use previous password');

    foundUser.set({ password });
    await foundUser.save();

    return `Password Updated Successfully`;
  }
}
