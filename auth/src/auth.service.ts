import { Injectable, BadRequestException } from '@nestjs/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './models/user.entity';

// DTO
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtAuthService: JwtService,
  ) {}

  // register unverified account
  async registerUnverified(user: RegisterUserDto): Promise<string> {
    const { firstName, lastName, password, phone } = user;

    const existingUser: UserDocument = await this.userModel.findOne({ phone });
    if (existingUser) throw new BadRequestException('Account already taken');

    const createdUser = new this.userModel({
      firstName,
      lastName,
      password,
      phone,
    });
    await createdUser.save();
    return 'Account Created Successfully';
  }
}
