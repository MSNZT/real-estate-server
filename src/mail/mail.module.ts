import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { mailConfig } from "./config/mail.config";
import { MailService } from "./mail.service";

@Module({
  imports: [MailerModule.forRootAsync(mailConfig)],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
