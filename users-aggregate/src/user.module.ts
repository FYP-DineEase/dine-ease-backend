// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, LoggerModule } from '@dine_ease/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [JwtAuthModule, LoggerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
