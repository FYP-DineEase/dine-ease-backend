import {
  Body,
  Injectable,
  HttpException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRoles, UserDetails } from '@dine_ease/common';
import axios from 'axios';

// DTO
import { LoginDto } from './dto/login.dto';

// Interface
import { User } from './interfaces/user.interface';

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: UserDetails): string {
    const token: string = this.jwtService.sign(user);
    return token;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ details: User; tokenPayload: UserDetails }> {
    try {
      const authResponse = await axios.post(
        'http://auth-srv:3000/api/auth/login',
        loginDto,
      );
      const { userId } = authResponse.data;
      if (!userId) throw new NotFoundException('User not found');

      const userResponse = await axios.get(
        `http://users-srv:3000/api/user/details/${userId}`,
      );
      const { email, name, slug, role, avatar, location } = userResponse.data;

      const details: User = {
        id: userId,
        slug,
        email,
        name,
        role,
        avatar,
        location,
      };

      const tokenPayload: UserDetails = { id: userId, role: details.role };

      return { details, tokenPayload };
    } catch (e) {
      throw new HttpException(e.response.data, e.response.data.statusCode);
    }
  }

  async userLogin(@Body() loginDto: LoginDto): Promise<object> {
    const { details, tokenPayload } = await this.login(loginDto);
    const token = this.generateToken(tokenPayload);
    return { details, token };
  }

  async adminLogin(@Body() loginDto: LoginDto): Promise<object> {
    const { details, tokenPayload } = await this.login(loginDto);
    if (details.role !== AdminRoles.ADMIN.toString()) {
      throw new ForbiddenException('Invalid User Role');
    }
    const token = this.generateToken(tokenPayload);
    return { details, token };
  }
}
