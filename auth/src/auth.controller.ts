import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: any): Promise<string> {
    return this.authService.login(credentials);
  }

  @Post('register')
  register(@Body() user: any): Promise<User> {
    return this.authService.register(user);
  }
}
