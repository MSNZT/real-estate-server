import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(
    private mailerService: MailerService,
    private configSerive: ConfigService,
  ) {}

  async sendResetPassword(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Сброс пароля",
        template: "reset-password",
        context: {
          code,
          CLIENT_URL: this.configSerive.getOrThrow("CLIENT_URL"),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException("Ошибка при отправке письма");
    }
  }
}
