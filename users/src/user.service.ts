import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

// JWT
import { UserDetails, AvatarUploadedEvent } from '@dine_ease/common';

// NATS
import { AccountCreatedEvent } from '@dine_ease/common';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

// DTO
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // find user
  async getUser(userId: Types.ObjectId): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findById(userId);
    if (!foundUser) throw new NotFoundException('Account not found');
    return foundUser;
  }

  // find user
  async findAuthUser(authDto: AuthDto): Promise<UserDocument> {
    const { authId } = authDto;
    const foundUser: UserDocument = await this.userModel.findOne({ authId });
    if (!foundUser) throw new NotFoundException('Account not found');
    return foundUser;
  }

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<void> {
    await this.userModel.create(user);
  }

  // update avatar of user
  async updateAvatar(data: AvatarUploadedEvent): Promise<string> {
    const foundUser = await this.userModel.findByIdAndUpdate(data.userId, {
      avatar: data.avatar,
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return 'Avatar Updated Successfully';
  }

  // update details of user
  async updateProfile(
    user: UserDetails,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const foundUser = await this.userModel.findByIdAndUpdate(
      user.id,
      updateUserDto,
      { new: true },
    );
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }
}
