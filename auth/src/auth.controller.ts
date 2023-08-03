import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

// Misc
import { UserDetails, GetUser, AuthGuard } from '@mujtaba-web/common';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserTokenDto } from './dto/user-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEmailDto } from './dto/user-email.dto';
import { UserPasswordDto } from './dto/user-password.dto';

@Controller('/api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('current-user')
  @UseGuards(AuthGuard)
  userDetails(@GetUser() user: UserDetails): UserDetails {
    return user;
  }

  @Post('login')
  login(@Body() userCredentialsDto: UserCredentialsDto): Promise<string> {
    return this.authService.login(userCredentialsDto);
  }

  @Post('register')
  registerUnverified(@Body() user: RegisterUserDto): Promise<string> {
    return this.authService.registerUnverified(user);
  }

  @Post('confirm')
  registerVerified(@Query() userToken: UserTokenDto): Promise<string> {
    return this.authService.registerVerified(userToken);
  }

  @Delete('remove-unverified')
  deleteUnverified(@Query() userToken: UserTokenDto): Promise<string> {
    return this.authService.deleteUnverifiedUser(userToken);
  }

  @Post('resend-confirmation')
  resendConfirmation(@Body() user: UserEmailDto): Promise<string> {
    return this.authService.resentVerification(user);
  }

  @Post('forgot-password')
  forgotPassword(@Body() user: UserEmailDto): Promise<string> {
    return this.authService.forgotPassword(user);
  }

  @Post('update-password')
  updatePassword(
    @Query() userToken: UserTokenDto,
    @Body() user: UserPasswordDto,
  ): Promise<string> {
    return this.authService.updatePassword(userToken, user);
  }
}
