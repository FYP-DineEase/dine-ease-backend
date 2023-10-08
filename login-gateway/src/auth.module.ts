// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, LoggerModule } from '@dine_ease/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule, LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
