import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

// DTO
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  // send confirmation email
  async sendUserConfirmation(user: CreateUserDto): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your Email on LocalHost',
      template: './verification',
      context: {
        name: user.email,
        verificationLink: `http://localhost:3000/users/confirm?token=${user.verifyToken}`,
        deleteAccountLink: `http://localhost:3000/users/remove-unverified?token=${user.deleteToken}`,
      },
    });
  }

  // verification for password update
  async updatePassword(user: UpdatePasswordDto): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Update Password on LocalHost',
      template: './password-reset',
      context: {
        name: user.email,
        updateLink: `http://localhost:3000/users/update-password?token=${user.token}`,
      },
    });
  }

  async notifyUsers(users: UserDto[]): Promise<void> {
    const batchSize = 20;

    // Send emails in batches
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const emailPromises = batch.map(async (user) => {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Updated Content on LocalHost',
          template: './notification',
          context: {
            name: user.email,
          },
        });
      });

      await Promise.all(emailPromises);
    }
  }
}
