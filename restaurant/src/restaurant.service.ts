import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDetails, UserRoles } from '@dine_ease/common';
import { StatusTypes } from './enums/restaurant-status.enum';

// Services
import { TwilioService } from './services/twilio.service';
import { RedisService } from './redis/redis.service';

// Logger
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// Database
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './models/restaurant.entity';
import {
  RestaurantApproval,
  ApprovalDocument,
} from './models/restaurant-approval.entity';

// DTO
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantIdDto } from './dto/restaurant-id.dto';
import { RestaurantNameDto } from './dto/restaurant-name.dto';
import { RestaurantStatusDto } from './dto/restaurant-status.dto';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly redisService: RedisService,
    private readonly twilioService: TwilioService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RestaurantApproval.name)
    private approvalModel: Model<ApprovalDocument>,
  ) {}

  // check restaurant name uniqueness
  async checkRestaurantExists(nameDto: RestaurantNameDto): Promise<boolean> {
    const { name } = nameDto;
    const existingUser = await this.restaurantModel.findOne({ name });
    return !!existingUser;
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
      isVerified: true,
    });
    return restaurants;
  }

  // get pending restaurants
  async getPending(): Promise<RestaurantDocument[]> {
    const restaurants: RestaurantDocument[] = await this.restaurantModel.find({
      status: StatusTypes.PENDING,
      isDeleted: false,
      isVerified: true,
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

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: idDto.restaurantId,
      isDeleted: false,
    });

    if (!found) throw new NotFoundException('Restaurant not found');

    found.set({ status });
    await found.save();

    this.approvalModel.create({
      adminId: user.id,
      restaurantId: found.id,
      status,
      remarks,
    });

    return `Restaurant status updated to ${status} successfully`;
  }

  // all approval/rejection records
  async getRecords(): Promise<ApprovalDocument[]> {
    const records: ApprovalDocument[] = await this.approvalModel.find();
    return records;
  }

  // create a restaurant listing
  async createRestaurant(
    user: UserDetails,
    data: RestaurantDto,
  ): Promise<string> {
    const { name, taxId } = data;

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      $or: [{ name }, { taxId }],
    });

    if (found) throw new ConflictException('Restaurant already exist');

    this.restaurantModel.create({ userId: user.id, ...data });
    return 'Restaurant created successfully';
  }

  // genrate OTP for verification of restaurant
  async generateOTP(
    idDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const { restaurantId } = idDto;

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: restaurantId,
      isDeleted: false,
    });

    if (!found) throw new NotFoundException('Restaurant not found');

    if (found.userId !== user.id) {
      this.logger.warn(
        `User: ${user.id} attempted to generate OTP of Restaurant: ${found.id}`,
      );
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

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: idDto.restaurantId,
      isDeleted: false,
    });

    if (!found) throw new NotFoundException('Restaurant not found');

    if (found.isVerified) {
      throw new BadRequestException('Restaurant is already verified');
    }

    if (found.userId !== user.id) {
      this.logger.warn(
        `User: ${user.id} attempted to verify OTP of Restaurant: ${found.id}`,
      );
      throw new UnauthorizedException('User is not authorized');
    }

    const cachedOTP = await this.redisService.getValue(
      user.id.toString(),
      found.id.toString(),
    );

    if (otp === +cachedOTP) {
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
    data: RestaurantDto,
  ): Promise<string> {
    const { restaurantId } = idDto;
    const { name, taxId, phoneNumber } = data;

    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: restaurantId,
      isDeleted: false,
    });

    if (!found) throw new NotFoundException('Restaurant not found');

    if (found.userId === user.id || user.role === UserRoles.ADMIN) {
      const existing: RestaurantDocument = await this.restaurantModel.findOne({
        _id: { $ne: restaurantId },
        $or: [{ name }, { taxId }],
      });

      if (existing) {
        throw new ConflictException('Restaurant details is already in use');
      }
      if (found.taxId !== taxId) {
        found.set({ status: StatusTypes.PENDING });
      }
      if (found.phoneNumber !== phoneNumber) {
        found.set({ isVerified: false });
      }
      found.set(data);
      await found.save();
      return 'Restaurant updated successfully';
    }

    this.logger.warn(
      `User: ${user.id} attempted to delete Restaurant: ${found.id}`,
    );
    throw new UnauthorizedException('User is not authorized');
  }

  // delete a restaurant
  async deleteRestaurant(
    idDto: RestaurantIdDto,
    user: UserDetails,
  ): Promise<string> {
    const found: RestaurantDocument = await this.restaurantModel.findOne({
      _id: idDto.restaurantId,
      isDeleted: false,
    });
    if (!found) throw new NotFoundException('Restaurant not found');

    if (found.userId === user.id || user.role === UserRoles.ADMIN) {
      found.set({ isDeleted: true });
      await found.save();

      this.logger.info(`User: ${user.id} deleted the Restaurant: ${found.id}`);
      return 'Restaurant deleted successfully';
    }

    this.logger.warn(
      `User: ${user.id} attempted to delete Restaurant: ${found.id}`,
    );
    throw new UnauthorizedException('User is not authorized');
  }
}
