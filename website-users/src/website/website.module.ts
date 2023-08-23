// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WebsiteService } from './website.service';
import { Website, WebsiteSchema } from './schemas/website.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }]),
  ],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
