import { Controller, Body, Post, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import axios from 'axios';

@Controller('/api/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginUserDto: LoginUserDto): Promise<object> {
    const authResponse = await axios.post(
      `http://localhost:3001/api/auth/login`,
      loginUserDto,
    );

    const authId = authResponse.data?.authId;

    if (!authId) {
      throw new NotFoundException('User not found');
    }

    const userResponse = await axios.get(
      `http://localhost:3002/api/user/login/${authId}`,
    );

    const { id, email, role, fullName, avatar } = userResponse.data;
    const token = this.authService.generateToken(id);
    return {
      details: {
        id,
        email,
        role,
        fullName,
        avatar,
      },
      token,
    };
  }
}
