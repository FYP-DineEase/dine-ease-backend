import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';

// NATS
import { AccountCreatedEvent, Subjects } from '@dine_ease/common';
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';

// DTO
import { EmailDto } from './dto/email.dto';

@Controller('/api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(Subjects.AccountCreated)
  async registerUnverified(
    @Payload() data: AccountCreatedEvent,
    @Ctx() context: NatsStreamingContext,
  ): Promise<void> {
    await this.mailService.register(data);
    context.message.ack();
  }

  @Get('resend-confirmation/:email')
  resendConfirmation(@Param() emailDto: EmailDto): Promise<string> {
    return this.mailService.resendConfirmation(emailDto);
  }

  @Get('forgot-password/:email')
  forgotPassword(@Param() emailDto: EmailDto): Promise<string> {
    return this.mailService.forgotPassword(emailDto);
  }
}
