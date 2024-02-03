import { Controller, Body, Post } from '@nestjs/common';

// Service
import { LoginService } from './login.service';

// DTO
import { LoginDto } from './dto/login.dto';

@Controller('/api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/admin')
  async adminLogin(@Body() loginDto: LoginDto): Promise<object> {
    return this.loginService.adminLogin(loginDto);
  }

  @Post()
  async login(@Body() loginDto: LoginDto): Promise<object> {
    return this.loginService.userLogin(loginDto);
  }
}
