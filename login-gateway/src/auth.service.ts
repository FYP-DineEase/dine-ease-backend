import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDetails } from '@dine_ease/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: UserDetails): string {
    try {
      const token: string = this.jwtService.sign({ id: user });
      return token;
    } catch (e) {
      console.log(e);
    }
  }
}
