import {
  Injectable,
  Body,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDetails } from '@dine_ease/common';
import axios from 'axios';

// DTO
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: UserDetails): string {
    const token: string = this.jwtService.sign(user);
    return token;
  }

  async login(@Body() loginDto: LoginDto): Promise<object> {
    try {
      const authResponse = await axios.post(
        `http://localhost:3001/api/auth/login`,
        loginDto,
      );

      const { userId } = authResponse.data;

      if (!userId) {
        throw new NotFoundException('User not found');
      }

      const userResponse = await axios.get(
        `http://localhost:3002/api/user/details/${userId}`,
      );

      const details = userResponse.data;
      const token = this.generateToken({ id: userId, role: details.role });
      return { details, token };
    } catch (e) {
      throw new HttpException(e.response.data, e.response.data.statusCode);
    }
  }
}
