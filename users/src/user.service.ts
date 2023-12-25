import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';
import { Model, Types } from 'mongoose';

// Services
import { S3Service } from './services/aws-s3.service';

// NATS
import { AccountCreatedEvent } from '@dine_ease/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

// DTO
import { UsersDto } from './dto/mongo-id.dto';
import { UserSlugDto } from './dto/slug.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserStorageDto } from './dto/storage.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // find user by token
  async getUserById(userId: Types.ObjectId): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel
      .findById(userId)
      .select('id email role firstName lastName fullName avatar');
    if (!foundUser) throw new NotFoundException('Account not found');
    return foundUser;
  }

  // find user by slug
  async getUserBySlug(userSlugDto: UserSlugDto): Promise<UserDocument> {
    const { slug } = userSlugDto;
    const foundUser: UserDocument = await this.userModel.findOne({ slug });
    if (!foundUser) throw new NotFoundException('Account not found');
    return foundUser;
  }

  // find user by their ids
  async getUserByIds(
    usersDto: UsersDto,
  ): Promise<Record<string, UserDocument>> {
    const { users } = usersDto;

    const found: UserDocument[] = await this.userModel
      .find({ _id: { $in: users } })
      .select('id email role firstName lastName fullName avatar');

    const foundUsers = found.reduce(
      (acc: Record<string, UserDocument>, user: UserDocument) => {
        acc[user.id.toString()] = user;
        return acc;
      },
      {},
    );

    return foundUsers;
  }

  // fetch all users
  async getAllUsers(): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel
      .find()
      .select('slug firstName lastName fullName avatar');
    return users;
  }

  // register unverified account
  async registerUnverified(user: AccountCreatedEvent): Promise<void> {
    const { userId, ...details } = user;
    const newData = { _id: userId, ...details };
    await this.userModel.create(newData);
  }

  // update avatar of user
  async uploadUserImage(
    file: Express.Multer.File,
    userStorageDto: UserStorageDto,
    user: UserDetails,
  ): Promise<string> {
    const { type } = userStorageDto;

    const found: UserDocument = await this.userModel.findById(user.id);
    if (!found) throw new NotFoundException('User not found');

    const path = `${user.id}/${type}`;
    const deleteKey = found[type];

    const newImage = await this.s3Service.upload(path, file);
    found.set({ [type]: newImage });
    await found.save();

    if (deleteKey) {
      await this.s3Service.deleteOne(`${path}/${deleteKey}`);
    }

    return 'User Image Updated Successfully';
  }

  // update details of user
  async updateProfile(
    user: UserDetails,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findByIdAndUpdate(
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
    const foundUser = await this.userModel.findByIdAndUpdate(
      user.id,
      updateLocationDto,
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
