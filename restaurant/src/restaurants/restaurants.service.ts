import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserDetails, StatusTypes, AdminRoles } from '@dine_ease/common';
import { RecordType } from 'src/enums/record.enum';

// Services
import { RedisService } from 'src/redis/redis.service';
import { TwilioService } from 'src/services/twilio.service';
import { ModifyService } from 'src/modify/modify.service';
import { RecordsService } from 'src/records/records.service';

// Database
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './models/restaurant.entity';

// NATS
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// DTO
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { RestaurantNameDto } from './dto/name.dto';
import { RestaurantStatusDto } from './dto/status.dto';
import { CreateRestaurantDto } from './dto/create.dto';
import { PrimaryDetailsDto } from './dto/primary-details.dto';
import { UpdateRestaurantDto } from './dto/update.dto';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly publisher: Publisher,
    private readonly redisService: RedisService,
    private readonly twilioService: TwilioService,
    private readonly modifyService: ModifyService,
    private readonly recordsService: RecordsService,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // check restaurant name uniqueness
  async checkRestaurantExists(nameDto: RestaurantNameDto): Promise<boolean> {
    const { name } = nameDto;
    const existingUser = await this.restaurantModel.findOne({ name });
    return !!existingUser;
  }

  // find restaurant by id
  async findRestaurantById(id: RestaurantIdDto): Promise<RestaurantDocument> {
    const { restaurantId } = id;

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: restaurantId,
      isDeleted: false,
    });

    if (!found) throw new NotFoundException('Restaurant not found');
    return found;
  }

  // find duplicate data
  async findRestaurant(data: PrimaryDetailsDto, id?: string): Promise<void> {
    const { name, taxId } = data;
    const restaurantId = new Types.ObjectId(id);

    const query: any = { $or: [{ name }, { taxId }] };
    if (restaurantId) query._id = { $ne: restaurantId };

    const found: RestaurantDocument = await this.restaurantModel.findOne(query);
    if (found) throw new ConflictException('Restaurant already exists');
  }

  // get all restaurants
  async getAll(): Promise<RestaurantDocument[]> {
    const restaurants: RestaurantDocument[] = await this.restaurantModel.find();
    return restaurants;
  }

  // get approved restaurants
  async getApproved(): Promise<RestaurantDocument[]> {
    const restaurants: RestaurantDocument[] = await this.restaurantModel.find({
      status: StatusTypes.APPROVED,
      isDeleted: false,
    });
    return restaurants;
  }

  // get pending restaurants
  async getPending(): Promise<RestaurantDocument[]> {
    const restaurants: RestaurantDocument[] = await this.restaurantModel.find({
      status: StatusTypes.PENDING,
      isDeleted: false,
    });
    return restaurants;
  }

  // restaurant approval/rejection restaurant
  async restaurantStatus(
    idDto: RestaurantIdDto,
    user: UserDetails,
    restaurantDto: RestaurantStatusDto,
  ): Promise<string> {
    const { status, remarks } = restaurantDto;

    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.status === StatusTypes.APPROVED) {
      throw new BadRequestException('Restaurant is already approved');
    }

    if (status === StatusTypes.APPROVED) {
      found.set({ status });
      await found.save();
    } else {
      await found.deleteOne();
    }

    const payload = {
      adminId: String(user.id),
      restaurantId: String(found.id),
      status,
      type: RecordType.LISTING,
      remarks,
    };
    await this.recordsService.createRecord(payload);

    return `Restaurant status updated successfully`;
  }

  // create a restaurant listing
  async createRestaurant(
    user: UserDetails,
    data: CreateRestaurantDto,
  ): Promise<string> {
    await this.findRestaurant(data);
    await this.modifyService.findRestaurant(data);
    this.restaurantModel.create({ userId: user.id, ...data });
    return 'Restaurant created successfully';
  }

  // genrate OTP for verification of restaurant
  async generateOTP(
    idDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const { restaurantId } = idDto;

    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (found.isVerified) {
      throw new BadRequestException('Restaurant is already verified');
    }

    // twilioService.sendOTP later
    await this.redisService.cacheWrapper(
      user.id.toString(),
      restaurantId.toString(),
      120,
      async () => {
        return await this.twilioService.generateOTP();
      },
    );

    return 'OTP generated succesfully';
  }

  // verify OTP of restaurant
  async verifyOTP(
    idDto: RestaurantIdDto,
    user: UserDetails,
    otpDto: OtpDto,
  ): Promise<string> {
    const { otp } = otpDto;
    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.isVerified) {
      throw new BadRequestException('Restaurant is already verified');
    }

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    const cachedOTP = await this.redisService.getValue(
      user.id.toString(),
      found.id.toString(),
    );

    if (otp === cachedOTP) {
      found.set({ isVerified: true });
      await found.save();
      this.redisService.deleteValue(user.id.toString(), found.id.toString());
      return 'OTP verified successfully';
    }

    throw new BadRequestException('Unable to verify OTP');
  }

  // update a restaurant
  async updateRestaurant(
    idDto: RestaurantIdDto,
    user: UserDetails,
    data: UpdateRestaurantDto,
  ): Promise<string> {
    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    found.set(data);

    if (found.phoneNumber !== data.phoneNumber) {
      found.set({ isVerified: false });
    }

    await found.save();
    return 'Restaurant updated successfully';
  }

  // update a restaurant
  async updatePrimaryDetails(
    idDto: RestaurantIdDto,
    user: UserDetails,
    data: PrimaryDetailsDto,
  ): Promise<string> {
    const { restaurantId } = idDto;

    // check uniqueness
    await this.modifyService.findRestaurant(data, restaurantId);
    await this.findRestaurant(data, restaurantId);

    // find restaurant
    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.userId !== user.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    if (found.status === StatusTypes.PENDING) {
      found.set(data);
      await found.save();
    } else {
      const payload = {
        userId: String(user.id),
        restaurantId: String(found.id),
        ...data,
      };
      return await this.modifyService.createRequest(payload);
    }

    return 'Restaurant updated successfully';
  }

  // approve update request
  async restaurantRequest(
    idDto: RestaurantIdDto,
    user: UserDetails,
    restaurantDto: RestaurantStatusDto,
  ): Promise<string> {
    const { status, remarks } = restaurantDto;

    const request = await this.modifyService.restaurantRequest(idDto);

    if (status === StatusTypes.APPROVED) {
      const found: RestaurantDocument = await this.findRestaurantById(idDto);
      const { taxId, name } = request;
      found.set({ taxId, name });
      await found.save();
    }

    const payload = {
      adminId: String(user.id),
      restaurantId: String(request.restaurantId),
      status,
      type: RecordType.MODIFY,
      remarks,
    };
    await this.recordsService.createRecord(payload);

    await request.deleteOne();

    return 'Restaurant updated successfully';
  }

  // delete a restaurant
  async deleteRestaurant(
    idDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const found: RestaurantDocument = await this.findRestaurantById(idDto);

    if (found.userId === user.id || user.role === AdminRoles.ADMIN) {
      if (found.status === StatusTypes.APPROVED) {
        found.set({ isDeleted: true });
        await found.save();
      } else {
        found.deleteOne();
      }
      return 'Restaurant deleted successfully';
    }

    throw new UnauthorizedException('User is not authorized');
  }
}
