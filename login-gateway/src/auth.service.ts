import {
  Inject,
  Injectable,
  Body,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDetails } from '@dine_ease/common';
import axios from 'axios';

// DTO
import { LoginUserDto } from './dto/login-user.dto';

// Logger
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(user: UserDetails): string {
    try {
      const token: string = this.jwtService.sign(user);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  async login(@Body() loginUserDto: LoginUserDto): Promise<object> {
    try {
      const authResponse = await axios.post(
        `http://localhost:3001/api/auth/login`,
        loginUserDto,
      );

      const { authId } = authResponse.data;

      if (!authId) {
        throw new NotFoundException('User not found');
      }

      const userResponse = await axios.get(
        `http://localhost:3002/api/user/login/${authId}`,
      );

      const { id, email, role, fullName, avatar } = userResponse.data;
      const token = this.generateToken({ id, role });
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
    } catch (e) {
      throw new HttpException(e.response.data, e.response.data.statusCode);
    }
  }
}
