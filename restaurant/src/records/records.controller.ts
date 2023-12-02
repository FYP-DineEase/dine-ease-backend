import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, AdminRoles } from '@dine_ease/common';
import { RecordsService } from './records.service';
import { RecordDocument } from './models/record.entity';

@Controller('/api/restaurant/records')
export class RecordsController {
  constructor(private readonly recordService: RecordsService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRoles.ADMIN)
  getRecords(): Promise<RecordDocument[]> {
    return this.recordService.getRecords();
  }
}
