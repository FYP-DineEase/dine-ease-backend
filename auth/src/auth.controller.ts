import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('current-user')
  userDetails(): string {
    return 'me';
  }

  @Post('login')
  login(@Body() userCredentialsDto: UserCredentialsDto): Promise<string> {
    return this.authService.login(userCredentialsDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }
}
