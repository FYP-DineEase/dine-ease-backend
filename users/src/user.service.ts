import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDetails } from '@dine_ease/common';
import { Model, Types } from 'mongoose';

// Services
import { S3Service } from './services/aws-s3.service';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import {
  Subjects,
  AccountCreatedEvent,
  AccountUpdatedEvent,
} from '@dine_ease/common';

// Database
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.entity';

// DTO
import { UserSlugDto } from './dto/slug.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserStorageDto } from './dto/storage.dto';

// Enum
import { UserStorage } from './enums/storage.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly publisher: Publisher,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // find user by token
  async getUserById(userId: Types.ObjectId): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findById(userId);
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

  // fetch all user slugs
  async getAllUserSlugs(): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel
      .find({}, { _id: 0, slug: 1 })
      .lean();
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

    if (type === UserStorage.AVATAR) {
      const { id: userId, avatar, version } = found;
      const event: AccountUpdatedEvent = { userId, avatar, version };
      this.publisher.emit<void, AccountUpdatedEvent>(
        Subjects.AccountUpdated,
        event,
      );
    }

    return newImage;
  }

  // update details of user
  async updateProfile(
    user: UserDetails,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const { firstName, lastName, description, location } = updateUserDto;

    const found: UserDocument = await this.userModel.findById(user.id);
    if (!found) throw new NotFoundException('User not found');

    found.set({ firstName, lastName, description, location });
    const emitData = ['firstName', 'lastName'].some((v) => found.isModified(v));

    await found.save();

    if (emitData) {
      const { id: userId, name, version } = found;
      const event: AccountUpdatedEvent = { userId, name, version };
      this.publisher.emit<void, AccountUpdatedEvent>(
        Subjects.AccountUpdated,
        event,
      );
    }

    return found;
  }

  // update location of user
  async updateLocation(
    user: UserDetails,
    updateLocationDto: UpdateLocationDto,
  ): Promise<string> {
    const { location } = updateLocationDto;

    const foundUser = await this.userModel.findByIdAndUpdate(
      user.id,
      { location },
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
