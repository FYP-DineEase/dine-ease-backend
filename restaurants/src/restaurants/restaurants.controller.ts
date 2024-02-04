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
  UploadedFile,
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

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

// Rate Limit
import { RateLimiterGuard } from 'src/guards/rate-limiter.guard';
import { RateLimit } from 'src/decorators/rate-limit.decorator';

// Restaurant
import { RestaurantsService } from './restaurants.service';
import { RestaurantDocument } from './models/restaurant.entity';

// DTO
import { OtpDto } from './dto/otp.dto';
import { RestaurantSlugDto } from './dto/slug.dto';
import { RestaurantIdDto } from './dto/mongo-id.dto';
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantStatusDto } from './dto/status.dto';
import { DeleteImagesDto } from './dto/delete-images.dto';
import { PrimaryDetailsDto } from './dto/primary-details.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('/api/restaurant')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Get('check')
  async checkRestaurant(@Query() data: PrimaryDetailsDto): Promise<void> {
    return await this.restaurantService.findRestaurant(data);
  }

  @Get('all/slug')
  async getAllUserSlugs(): Promise<RestaurantDocument[]> {
    return this.restaurantService.getAllRestaurantSlugs();
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
  ): Promise<{ ttl: number }> {
    return this.restaurantService.generateOTP(id, user);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getUserRestaurants(
    @GetUser() user: UserDetails,
  ): Promise<RestaurantDocument[]> {
    return this.restaurantService.getUserRestaurants(user);
  }

  @Get('/:slug')
  async findRestaurantBySlug(
    @Param() restaurantSlugDto: RestaurantSlugDto,
  ): Promise<RestaurantDocument> {
    return this.restaurantService.findRestaurantBySlug(restaurantSlugDto);
  }

  @Post('/upload/cover/:restaurantId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
      }),
      new MaxImageSizeValidator(),
    )
    file: Express.Multer.File,
    @Param() idDto: RestaurantIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.restaurantService.uploadCover(idDto, user, file);
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
  ): Promise<string[]> {
    return this.restaurantService.uploadImages(idDto, files, user);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  async createRestaurant(
    @GetUser() user: UserDetails,
    @Body() data: RestaurantDto,
  ): Promise<{ slug: string }> {
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
  ): Promise<RestaurantDocument> {
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
