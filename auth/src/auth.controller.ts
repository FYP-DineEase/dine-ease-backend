import { Controller, Body, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO
import { EmailDto } from './dto/email.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-email')
  async checkEmail(@Query() emailDto: EmailDto): Promise<{ isExist: boolean }> {
    const isExist = await this.authService.checkEmailExists(emailDto);
    return { isExist };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ isExist: boolean }> {
    const isExist = await this.authService.login(loginUserDto);
    return { isExist };
  }

  @Post('register')
  registerUnverified(@Body() user: RegisterUserDto): Promise<string> {
    return this.authService.registerUnverified(user);
  }

  @Post('update-password')
  updatePassword(
    @Query('token') token: string,
    @Body() user: ForgotPasswordDto,
  ): Promise<string> {
    return this.authService.updatePassword(token, user);
  }
}
