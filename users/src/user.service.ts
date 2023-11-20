import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDetails, UserStorage } from '@dine_ease/common';
import { Types } from 'mongoose';

// NATS
import {
  AccountCreatedEvent,
  UserStorageUploadedEvent,
} from '@dine_ease/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from './models/user.entity';

// DTO
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

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

  // fetch all users
  async getAllUsers(): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel
      .find()
      .select('slug fullName avatar');
    return users;
  }

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<void> {
    await this.userModel.create(user);
  }

  // update avatar of user
  async updateUserImage(data: UserStorageUploadedEvent): Promise<string> {
    const { userId, type, image, version } = data;

    const found = await this.userModel.findByEvent({ userId, version });
    if (!found) throw new NotFoundException('User not found');

    found.set({ [type === UserStorage.AVATAR ? 'avatar' : 'cover']: image });
    await found.save();

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

  // update location of user
  async updateLocation(
    user: UserDetails,
    updateLocationDto: UpdateLocationDto,
  ): Promise<string> {
    const { latitude, longitude } = updateLocationDto;
    const coordinates = [longitude, latitude];

    const foundUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { location: { coordinates } },
      { new: true },
    );
    if (!foundUser) throw new NotFoundException('User not found');
    return 'Location Updated Successfully';
  }

  // delete location of user
  async deleteLocation(user: UserDetails): Promise<string> {
    const foundUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { $unset: { location: 1 } },
      { new: true },
    );

    if (!foundUser) throw new NotFoundException('User not found');
    return 'Location Deleted Successfully';
  }
}
