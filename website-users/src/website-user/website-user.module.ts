// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@mujtaba-web/common';

import { WebsiteUserService } from './website-user.service';
import { WebsiteUserController } from './website-user.controller';
import { WebsiteUser, WebsiteUserSchema } from './schemas/website-user.schema';
import { WebsiteModule } from 'src/website/website.module';

@Module({
  imports: [
    JwtAuthModule,
    WebsiteModule,
    MongooseModule.forFeature([
      { name: WebsiteUser.name, schema: WebsiteUserSchema },
    ]),
  ],
  providers: [WebsiteUserService],
  controllers: [WebsiteUserController],
})
export class WebsiteUserModule {}
