// Modules
import { Module } from '@nestjs/common';
import { JwtAuthModule, LoggerModule } from '@dine_ease/common';
import { ConfigModule } from './config/config.module';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [ConfigModule, JwtAuthModule, LoggerModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
