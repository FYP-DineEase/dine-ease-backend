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
import { UserPayload, GetUser, AuthGuard } from '@mujtaba-web/common';

// DTO
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('/api/users')
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
  registerUnverified(@Body() user: RegisterUserDto): Promise<string> {
    return this.authService.registerUnverified(user);
  }

  @Post('confirm')
  registerVerified(@Query() userToken: VerifyUserDto): Promise<string> {
    return this.authService.registerVerified(userToken);
  }

  @Delete('remove-unverified')
  deleteUnverified(@Query() userToken: VerifyUserDto): Promise<string> {
    return this.authService.deleteUnverifiedUser(userToken);
  }
}
