import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller";
import { OAuthController } from "./controllers/oauth.controller";
import { OAuthService } from "./services/oauth.service";
import { AuthService } from "./services/auth.service";
import { jwtConfig } from "./config/jwt.config";
import { UserModule } from "@/user/user.module";
import { MailModule } from "@/mail/mail.module";
import { STRATEGIES } from "./strategies";

@Module({
  controllers: [AuthController, OAuthController],
  providers: [OAuthService, AuthService, ...STRATEGIES],
  imports: [UserModule, MailModule, JwtModule.registerAsync(jwtConfig)],
})
export class AuthModule {}
