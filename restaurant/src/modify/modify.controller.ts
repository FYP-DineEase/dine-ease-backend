import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Roles,
  RolesGuard,
  AdminRoles,
  UserRoles,
  UserDetails,
  GetUser,
} from '@dine_ease/common';

import { ModifyService } from './modify.service';
import { ModifyRequestDocument } from './models/request.entity';

// DTO
import { RequestIdDto, RestaurantIdDto } from './dto/mongo-id.dto';

@Controller('/api/restaurant/modify')
@UseGuards(AuthGuard, RolesGuard)
export class ModifyController {
  constructor(private readonly recordService: ModifyService) {}

  @Get()
  @Roles(AdminRoles.ADMIN)
  getRequests(): Promise<ModifyRequestDocument[]> {
    return this.recordService.getRequests();
  }

  @Get('/:restaurantId')
  @Roles(UserRoles.MANAGER)
  getRestaurantRequest(
    @Param() restaurantId: RestaurantIdDto,
  ): Promise<ModifyRequestDocument> {
    return this.recordService.restaurantRequest(restaurantId);
  }

  @Delete('/:requestId')
  @Roles(UserRoles.MANAGER)
  deleteRequest(
    @Param() id: RequestIdDto,
    @GetUser() user: UserDetails,
  ): Promise<string> {
    return this.recordService.deleteRequest(id, user);
  }
}
