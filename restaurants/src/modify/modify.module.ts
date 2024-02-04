// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModifyController } from './modify.controller';
import { ModifyService } from './modify.service';
import { ModifyRequest, ModifyRequestSchema } from './models/request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModifyRequest.name, schema: ModifyRequestSchema },
    ]),
  ],
  providers: [ModifyService],
  controllers: [ModifyController],
  exports: [ModifyService],
})
export class ModifyModule {}
