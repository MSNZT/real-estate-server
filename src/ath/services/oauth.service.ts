import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { OAuthProfile } from "../types/oauth-profile";
import { UserService } from "@/user/user.service";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenPayload } from "../types/token.types";
import { OAuthRegisterDto } from "../dto/oauth-register.dto";

@Injectable()
export class OAuthService {
  logger = new Logger(OAuthService.name);
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async loginWithSocial(userProfile: OAuthProfile) {
    try {
      let user = await this.userService.findByEmail(userProfile.email);
      if (user) {
        return {
          userId: user.id,
          ...(await this.authService.generateUserTokens(user)), // ДОДЕЛАТЬ
        };
      }
      return null;
    } catch (error) {
      this.logger.error("Произошла ошибка в login with social", error);
    }
  }

  async validateOAuthRegisterToken(registerToken: string) {
    try {
      await this.jwtService.verifyAsync<AuthTokenPayload>(registerToken);
      return {
        status: "success",
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException(
          "Время авторизации истекло. Повторите вход через сервис снова.",
        );
      }
      if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Недействительный токен авторизации");
      }
    }
  }

  async completeOAuthRegistration(
    dto: OAuthRegisterDto,
    registerToken: string,
  ) {
    try {
      const payload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(registerToken);

      const user = await this.userService.create({
        phone: dto.phone,
        ...payload,
      });

      return {
        user,
        tokens: await this.authService.generateUserTokens(user),
      };
    } catch (error) {
      this.logger.error(error);
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException(
          "Время авторизации истекло. Повторите вход через сервис снова.",
        );
      }
      if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Недействительный токен авторизации");
      }
      throw error;
    }
  }

  async generateRegisterToken(userProfile: OAuthProfile) {
    return await this.jwtService.signAsync(
      {
        email: userProfile.email,
        name: userProfile.name,
      },
      { expiresIn: "10m" },
    );
  }
}
