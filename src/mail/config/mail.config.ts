import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

export const mailConfig = {
  useFactory: async (config: ConfigService) => ({
    transport: {
      host: config.get("SMTP_HOST"),
      port: config.get("SMTP_PORT"),
      secure: false,
      auth: {
        user: config.get("SMTP_USER"),
        pass: config.get("SMTP_PASSWORD"),
      },
    },
    defaults: {
      from: `"${config.get("SMTP_FROM_NAME")}" <${config.get("SMTP_FROM_EMAIL")}>`,
    },
    template: {
      dir: join(process.cwd(), "dist/src/mail/templates"),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
};
