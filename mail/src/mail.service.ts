import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  AccountCreatedEvent,
  EmailTokenPayload,
  EmailTokenTypes,
  JwtMailService,
} from '@dine_ease/common';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private jwtMailService: JwtMailService,
  ) {}

  // send confirmation
  async sendConfirmation(
    email: string,
    name: string,
    subject: string,
  ): Promise<void> {
    const verifyPayload: EmailTokenPayload = {
      email,
      tokenType: EmailTokenTypes.ACCOUNT_VERIFY,
    };
    const verifyToken: string = this.jwtMailService.signToken(verifyPayload);
    console.log(verifyToken);

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './verification',
      context: {
        name,
        verificationLink: `http://localhost:3000/users/confirm?token=${verifyToken}`,
      },
    });
  }

  // register
  async register(user: AccountCreatedEvent): Promise<string> {
    const { email, firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`;
    await this.sendConfirmation(
      email,
      fullName,
      'Verify your Email on LocalHost',
    );
    return 'Email verification sent';
  }

  // resend confirmation
  async resendConfirmation(emailDto: EmailDto): Promise<string> {
    const { email } = emailDto;
    await this.sendConfirmation(email, email, 'Update Password on LocalHost');
    return 'Email verification resent';
  }

  // resend email verification
  async forgotPassword(emailDto: EmailDto): Promise<string> {
    const { email } = emailDto;

    const verifyPayload: EmailTokenPayload = {
      email,
      tokenType: EmailTokenTypes.UPDATE_PASSWORD,
    };
    const passwordToken: string = this.jwtMailService.signToken(verifyPayload);
    console.log(passwordToken);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Update Password on LocalHost',
      template: './password-reset',
      context: {
        name: email,
        updateLink: `http://localhost:3000/users/update-password?token=${passwordToken}`,
      },
    });

    return 'Update password request sent';
  }
}
