import { Controller, Body, Post } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// DTO
import { LoginUserDto } from './dto/login-user.dto';

@Controller('/api/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return this.authService.login(loginUserDto);
  }
}
