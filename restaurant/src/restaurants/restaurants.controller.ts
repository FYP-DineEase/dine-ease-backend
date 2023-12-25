import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  FileTypeValidator,
  ParseFilePipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import {
  AuthGuard,
  GetUser,
  UserDetails,
  UserRoles,
  Roles,
  RolesGuard,
  AdminRoles,
  MaxImageSizeValidator,
} from '@dine_ease/common';

import { FilesInterceptor } from '@nestjs/platform-express';

// Rate Limit
import { RateLimiterGuard } from 'src/guards/rate-limiter.guard';
import { RateLimit } from 'src/decorators/rate-limit.decorator';

// Restaurant
import { RestaurantsService } from './restaurants.service';
import { RestaurantDocument } from './models/restaurant.entity';

// DTO
import { OtpDto } from './dto/otp.dto';
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantNameDto } from './dto/name.dto';
import { RestaurantStatusDto } from './dto/status.dto';
import { DeleteImagesDto } from './dto/delete-images.dto';
import { PaginationDto } from './dto/pagination.dto';

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
  async getAll(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getAll();
  }

  @Get('approved')
  async getApproved(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ count?: number; restaurants: RestaurantDocument[] }> {
    return this.restaurantService.getApproved(paginationDto);
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  async getPending(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getPending();
  }

  @Get('/generate-otp/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard, RateLimiterGuard)
  @Roles(UserRoles.MANAGER)
  @RateLimit({ keyPrefix: 'OTP', duration: 60 * 60 * 24, limit: 3 })
  async generateOTP(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.generateOTP(id, user);
  }

  @Get('/:restaurantId')
  async getRestaurantById(
    @Param() idDto: RestaurantIdDto,
  ): Promise<RestaurantDocument> {
    return this.restaurantService.findRestaurantById(idDto);
  }

  @Post('/upload/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadItemImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    files: Express.Multer.File[],
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.uploadImages(idDto, files, user);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async createRestaurant(
    @GetUser() user: UserDetails,
    @Body() data: RestaurantDto,
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

  @Patch('/details/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async updateRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantDto,
  ): Promise<string> {
    return this.restaurantService.updateRestaurant(id, user, data);
  }

  @Patch('/status/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  async restaurantStatus(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantStatusDto,
  ): Promise<string> {
    return this.restaurantService.restaurantStatus(id, user, data);
  }

  @Patch('/request/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  async restaurantRequest(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
    @Body() data: RestaurantStatusDto,
  ): Promise<string> {
    return this.restaurantService.restaurantRequest(id, user, data);
  }

  @Delete('/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN, UserRoles.MANAGER)
  async deleteRestaurant(
    @Param() id: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.deleteRestaurant(id, user);
  }

  @Delete('/images/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async deleteImages(
    @Param() id: RestaurantIdDto,
    @Body() data: DeleteImagesDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.deleteImages(id, data, user);
  }
}
