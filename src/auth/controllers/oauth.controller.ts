import { Body, Controller, Get, Query, Req, Res, Post } from "@nestjs/common";
import { Response } from "express";
import { AuthGoogle } from "../decorators/auth-google";
import { AuthYandex } from "../decorators/auth-yandex";
import { OAuthProfile } from "../types/oauth-profile";
import { OAuthService } from "../services/oauth.service";
import { ConfigService } from "@nestjs/config";
import { setTokenToCookie } from "../utils/setTokenToCookie";
import { OAuthRegisterDto } from "../dto/oauth-register.dto";
import { EXPIRES_REFRESH_TOKEN } from "../const/expires";

@Controller("oauth")
export class OAuthController {
  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService,
  ) {}

  @Get("google")
  @AuthGoogle()
  async googleAuth() {}

  @Get("google/callback")
  @AuthGoogle()
  async googleAuthCallback(
    @Req() req: Request & { user: OAuthProfile },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.OAuthLoginOrRegister(req, res);
  }

  @AuthYandex()
  @Get("yandex")
  async yandexAuth() {}

  @AuthYandex()
  @Get("yandex/callback")
  async yandexAuthCallback(
    @Req() req: Request & { user: OAuthProfile },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.OAuthLoginOrRegister(req, res);
  }

  @Get("validate")
  async validateOAuthRegisterToken(@Query("token") registerToken: string) {
    console.log("validate", registerToken);
    return await this.oauthService.validateOAuthRegisterToken(registerToken);
  }

  @Post("register")
  async completeOAuthRegistration(
    @Body() dto: OAuthRegisterDto,
    @Query("token") registerToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.oauthService.completeOAuthRegistration(
      dto,
      registerToken,
    );

    setTokenToCookie(
      res,
      "refreshToken",
      tokens.refreshToken,
      EXPIRES_REFRESH_TOKEN,
      this.configService,
    );

    return {
      user,
      token: tokens.accessToken,
    };
  }

  private async OAuthLoginOrRegister(
    req: Request & { user: OAuthProfile },
    res: Response,
  ) {
    const response = await this.oauthService.loginWithSocial(req.user);
    if (response?.userId) {
      setTokenToCookie(
        res,
        "refreshToken",
        response.refreshToken,
        EXPIRES_REFRESH_TOKEN,
        this.configService,
      );
      return res.redirect(
        `${this.configService.getOrThrow("CLIENT_URL")}/moscow/?token=${response.accessToken}`,
      );
    }

    const registerToken = await this.oauthService.generateRegisterToken(
      req.user,
    );

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/register/oauth?token=${registerToken}`,
    );
  }
}
