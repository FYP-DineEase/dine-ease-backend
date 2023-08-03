import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { EmailTokenTypes } from 'src/utils/enums/email-token.enum';
import { EmailTokenPayload } from './jwt-mail.interface';

@Injectable()
export class JwtMailService {
  private readonly emailJwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.emailJwtSecret = this.configService.get<string>('EMAIL_JWT_SECRET');
  }

  signToken(data: EmailTokenPayload): string {
    const { email, tokenType, expiresIn } = data;
    const payload = { email, tokenType };
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.emailJwtSecret,
    });
  }

  async decodeToken(token: string, type: EmailTokenTypes): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.emailJwtSecret,
      });
      if (type === decoded.tokenType) return decoded.email;
      throw new BadRequestException('Invalid Token Type');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
