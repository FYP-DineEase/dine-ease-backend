import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your Email on LocalHost',
      template: './verification',
      context: {
        name: user.email,
      },
    });
  }

  async updatePassword(user: UserDto): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Update Password on LocalHost',
      template: './password-reset',
      context: {
        name: user.email,
      },
    });
  }

  async accountCreation(user: UserDto): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Account Creation on LocalHost',
      template: './account-creation',
      context: {
        name: user.name,
      },
    });
  }

  async notifyUsers(users: UserDto[]): Promise<void> {
    const batchSize = 50;

    // Send emails in batches
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const emailPromises = batch.map(async (user) => {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Updated Content on LocalHost',
          template: './notification',
          context: {
            name: user.name,
          },
        });
      });

      await Promise.all(emailPromises);
    }
  }
}
