import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';

// Misc
import {
  UserPayload,
  GetUser,
  AuthGuard,
  JsonBodyInterceptor,
} from '@mujtaba-web/common';

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
  @UseInterceptors(FileInterceptor('file'), new JsonBodyInterceptor('user'))
  registerUnverified(
    @UploadedFile() profilePicture: FileUploadDto,
    @Body('user') registerUserDto: RegisterUserDto,
  ): Promise<string> {
    return this.authService.registerUnverified(registerUserDto);
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
