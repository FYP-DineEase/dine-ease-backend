import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailTokenTypes } from 'src/utils/enums/email-token.enum';

@Injectable()
export class JwtMailService {
  private readonly emailJwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.emailJwtSecret = this.configService.get<string>('EMAIL_JWT_SECRET');
  }

  signToken(
    email: string,
    tokenType: EmailTokenTypes,
    expiresIn: string,
  ): string {
    const payload = { email, tokenType };
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.emailJwtSecret,
    });
  }

  decodeToken(token: string): { userId: string; tokenType: EmailTokenTypes } {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.emailJwtSecret,
      });
      return { userId: decoded.userId, tokenType: decoded.tokenType };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
