import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { EmailDto } from "../dto/base.dto";
import { ResetPasswordDto, ValidateCodeDto } from "../dto/reset-password.dto";
import { setTokenToCookie } from "../utils/setTokenToCookie";
import { EXPIRES_REFRESH_TOKEN } from "../const/expires";
import { removeTokenFromCookie } from "../utils/removeTokenFromCookies";
import { ConfigService } from "@nestjs/config";
import { AuthJwt } from "../decorators/auth-jwt.decorator";
import { CurrentUser } from "@/user/decorators/current-user";
import { User } from "@prisma/client";
import { UserDto } from "@/auth/dto/response";
import { Cookies } from "@/libs/decorators/cookies.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(dto);
    const tokens = await this.authService.generateUserTokens(user);

    setTokenToCookie(
      res,
      "refreshToken",
      tokens.refreshToken,
      EXPIRES_REFRESH_TOKEN,
      this.configService,
    );

    return {
      user: new UserResponseDto(user),
      token: tokens.accessToken,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(dto);

    setTokenToCookie(
      res,
      "refreshToken",
      tokens.refreshToken,
      EXPIRES_REFRESH_TOKEN,
      this.configService,
    );
    return {
      user: new UserResponseDto(user),
      token: tokens.accessToken,
    };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    removeTokenFromCookie(res, "refreshToken", this.configService);
    return {
      status: "success",
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("me")
  @AuthJwt()
  async getMe(@CurrentUser() user: User) {
    const profile = await this.authService.getMe(user.email);
    return new UserDto(profile);
  }

  @Post("forget-password")
  async forgetPassword(@Body() dto: EmailDto) {
    return await this.authService.forgetPassword(dto);
  }

  @Post("forget-password/validate")
  async validateForgetPasswordCode(@Body() dto: ValidateCodeDto) {
    return await this.authService.validateForgetPasswordCode(dto);
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @Get("refresh")
  async refreshToken(
    @Cookies("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token expired");
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    setTokenToCookie(
      res,
      "refreshToken",
      tokens.refreshToken,
      EXPIRES_REFRESH_TOKEN,
      this.configService,
    );
    return {
      token: tokens.accessToken,
    };
  }
}
