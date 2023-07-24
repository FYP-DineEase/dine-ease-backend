import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

// Misc
import { AuthGuard } from './guards/auth.guard';
import { UserPayload, GetUser } from '@mujtaba-web/common';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('current-user')
  @UseGuards(AuthGuard)
  userDetails(@GetUser() user: UserPayload): UserPayload {
    return user;
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
