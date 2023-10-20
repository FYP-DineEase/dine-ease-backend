import {
  Controller,
  Body,
  Param,
  Query,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  GetUser,
  UserDetails,
  UserRoles,
  Roles,
  RolesGuard,
} from '@dine_ease/common';

// Restaurant
import { RestaurantService } from './restaurant.service';
import { RestaurantDocument } from './models/restaurant.entity';
import { ApprovalDocument } from './models/restaurant-approval.entity';

// DTO
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantIdDto } from './dto/restaurant-id.dto';
import { RestaurantNameDto } from './dto/restaurant-name.dto';
import { RestaurantStatusDto } from './dto/restaurant-status.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('/api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('check')
  async checkRestaurant(
    @Query() nameDto: RestaurantNameDto,
  ): Promise<{ isExist: boolean }> {
    const isExist = await this.restaurantService.checkRestaurantExists(nameDto);
    return { isExist };
  }

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAll(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getAll();
  }

  @Get('approved')
  getVerified(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getApproved();
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getUnVerified(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getPending();
  }

  @Get('records')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getRecords(): Promise<ApprovalDocument[]> {
    return this.restaurantService.getRecords();
  }

  @Post('/status/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  restaurantStatus(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantStatusDto,
  ): Promise<string> {
    return this.restaurantService.restaurantStatus(id, user, data);
  }

  @Post('/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  createRestaurant(
    @GetUser() user: UserDetails,
    @Body() data: RestaurantDto,
  ): Promise<string> {
    return this.restaurantService.createRestaurant(user, data);
  }

  @Get('/generate-otp/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async generateOTP(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.generateOTP(id, user);
  }

  @Post('/verify-otp/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async verifyOTP(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() otpDto: OtpDto,
  ): Promise<string> {
    return this.restaurantService.verifyOTP(id, user, otpDto);
  }

  @Put('/update/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  updateRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantDto,
  ): Promise<string> {
    return this.restaurantService.updateRestaurant(id, user, data);
  }

  @Delete('/delete/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  deleteRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.deleteRestaurant(id, user);
  }
}
