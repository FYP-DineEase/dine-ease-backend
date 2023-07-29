import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAdminToken(payload: any): string {
    const secret = this.configService.get<string>('ADMIN_JWT_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn: '1d' });
  }

  createUserToken(payload: any): string {
    const secret = this.configService.get<string>('USER_JWT_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn: '7d' });
  }

  verifyAdminToken(token: string): any {
    const secret = this.configService.get<string>('ADMIN_JWT_SECRET');
    try {
      return this.jwtService.verify(token, { secret });
    } catch (err) {
      return null; // Token verification failed
    }
  }

  verifyUserToken(token: string): any {
    const secret = this.configService.get<string>('USER_JWT_SECRET');
    try {
      return this.jwtService.verify(token, { secret });
    } catch (err) {
      return null; // Token verification failed
    }
  }
}
