import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) throw new UnauthorizedException('No token provided');

    const decoded = await this.decodeToken(token);
    request.user = decoded;
    return true;
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    return authHeader.split(' ')[1];
  }

  private async decodeToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      return decodedToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
