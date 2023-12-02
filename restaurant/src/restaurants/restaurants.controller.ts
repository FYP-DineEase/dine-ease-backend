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
  AdminRoles,
} from '@dine_ease/common';

// Restaurant
import { RestaurantsService } from './restaurants.service';
import { RestaurantDocument } from './models/restaurant.entity';

// DTO
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { CreateRestaurantDto } from './dto/create.dto';
import { RestaurantNameDto } from './dto/name.dto';
import { RestaurantStatusDto } from './dto/status.dto';
import { UpdateRestaurantDto } from './dto/update.dto';
import { PrimaryDetailsDto } from './dto/primary-details.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('/api/restaurant')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Get('check')
  async checkRestaurant(
    @Query() nameDto: RestaurantNameDto,
  ): Promise<{ isExist: boolean }> {
    const isExist = await this.restaurantService.checkRestaurantExists(nameDto);
    return { isExist };
  }

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  getAll(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getAll();
  }

  @Get('approved')
  getVerified(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getApproved();
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  getUnVerified(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getPending();
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

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  createRestaurant(
    @GetUser() user: UserDetails,
    @Body() data: CreateRestaurantDto,
  ): Promise<string> {
    return this.restaurantService.createRestaurant(user, data);
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

  @Put('/details/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  updateRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: UpdateRestaurantDto,
  ): Promise<string> {
    return this.restaurantService.updateRestaurant(id, user, data);
  }

  @Put('/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  updatePrimaryDetails(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: PrimaryDetailsDto,
  ): Promise<string> {
    return this.restaurantService.updatePrimaryDetails(id, user, data);
  }

  @Put('/status/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  restaurantStatus(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantStatusDto,
  ): Promise<string> {
    return this.restaurantService.restaurantStatus(id, user, data);
  }

  @Put('/request/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  restaurantRequest(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantStatusDto,
  ): Promise<string> {
    return this.restaurantService.restaurantRequest(id, user, data);
  }

  @Delete('/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN, UserRoles.MANAGER)
  deleteRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.deleteRestaurant(id, user);
  }
}
