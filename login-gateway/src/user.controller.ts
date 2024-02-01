import { Controller, Body, Post } from '@nestjs/common';

// Service
import { UserService } from './user.service';

// DTO
import { LoginDto } from './dto/login.dto';

@Controller('/api/users-aggregate')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin/login')
  async adminLogin(@Body() loginDto: LoginDto): Promise<object> {
    return this.userService.adminLogin(loginDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<object> {
    return this.userService.userLogin(loginDto);
  }
}
