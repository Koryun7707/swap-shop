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
  /** Send email when blocked user account. */

  async sendEmailWhenBlockUser(
    user: UserDto,
    blockedUser: UserDto,
  ): Promise<any> {
    try {
      const html = `
        <p>${user.firstName} (${user.email})  blocked ${blockedUser.firstName} (${blockedUser.email}) </p>
        `;
      const EMAIL_1 = process.env.EMAIL_1;
      const EMAIL_2 = process.env.EMAIL_2;
      await this.mailerService.sendMail({
        to: EMAIL_1,
        subject: 'SwapShop Account Blocked',
        html,
      });
      await this.mailerService.sendMail({
        to: EMAIL_2,
        subject: 'SwapShop Account Blocked',
        html,
      });
    } catch (err) {
      this._logger.error(`Failed to send email when blocked`, err.stack);
      throw err;
    }
  }
}
