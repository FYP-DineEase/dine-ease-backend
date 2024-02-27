import { Controller, Body, Get, Post, Patch, Query } from '@nestjs/common';
import { Types } from 'mongoose';
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
  ): Promise<{ userId: Types.ObjectId }> {
    const userId = await this.authService.login(loginUserDto);
    return { userId };
  }

  @Post('register')
  async registerUnverified(
    @Body() user: RegisterUserDto,
  ): Promise<{ id: string; token: string }> {
    return this.authService.registerUnverified(user);
  }

  @Get('verify')
  async verifyAccount(@Query('token') token: string): Promise<string> {
    return this.authService.verifyAccount(token);
  }

  @Patch('update-password')
  async updatePassword(
    @Query('token') token: string,
    @Body() user: ForgotPasswordDto,
  ): Promise<string> {
    return this.authService.updatePassword(token, user);
  }
}
