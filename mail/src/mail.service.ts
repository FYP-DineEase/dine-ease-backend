import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: username,
      subject: 'Verify your Email on LocalHost',
      template: './verification',
      context: {
        name: username,
      },
    });
  }

  async updatePassword(username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: username,
      subject: 'Update Password on LocalHost',
      template: './password-reset',
      context: {
        name: username,
      },
    });
  }

  async accountCreation(name: string, username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: username,
      subject: 'Account Creation on LocalHost',
      template: './account-creation',
      context: {
        name,
      },
    });
  }
}
