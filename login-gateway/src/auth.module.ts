// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, LoggerModule } from '@dine_ease/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule, LoggerModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
