import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('/api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUnverified(@Body() user: RegisterUserDto): Promise<string> {
    return this.authService.registerUnverified(user);
  }
}
