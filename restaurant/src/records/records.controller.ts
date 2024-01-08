import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  Roles,
  RolesGuard,
  AdminRoles,
  UserRoles,
} from '@dine_ease/common';
import { RecordsService } from './records.service';
import { RecordDocument } from './models/record.entity';
import { RestaurantIdDto } from './dto/mongo-id.dto';

@Controller('/api/restaurant/records')
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  getRecords(): Promise<RecordDocument[]> {
    return this.recordService.getRecords();
  }

  @Get('/:restaurantId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  getRestaurantRecords(
    @Param() restaurantIdDto: RestaurantIdDto,
  ): Promise<RecordDocument[]> {
    return this.recordService.getRestaurantRecords(restaurantIdDto);
  }
}
