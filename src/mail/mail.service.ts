import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from '../user/dto/UserDto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);
  constructor(private mailerService: MailerService) {}

  /** Send email confirmation link to new user account. */
  async sendConfirmationEmail(user: UserDto, code: number): Promise<any> {
    try {
      const html = `
        <h2>SwapShop Account Verification</h2>
        <p>Your activation code is: ${code}</p>
        `;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'SwapShop Account Verification',
        html,
      });
    } catch (error) {
      this._logger.error(
        `Failed to send confirmation email to ${user.email}`,
        error.stack,
      );
      throw error;
    }
  }
}
