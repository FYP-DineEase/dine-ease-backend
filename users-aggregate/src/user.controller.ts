import { Controller, Body, Post } from '@nestjs/common';

// Service
import { UserService } from './user.service';

// DTO
import { LoginDto } from './dto/login.dto';

@Controller('/api/users-aggregate')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<object> {
    return this.userService.login(loginDto);
  }
}
