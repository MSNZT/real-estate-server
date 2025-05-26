import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Cookies } from "src/libs/decorators/cookies.decorator";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterCompletionDto, RegisterDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDto, UserDto } from "./dto/response";
import { HttpExceptionFilter } from "../errors/http-exception.filter";
import { JwtAuthGuard } from "./guards/jwt-auth-guard";
import { UserService } from "@/user/user.service";

@UseFilters(HttpExceptionFilter)
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("accounts")
  async accounts(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.accounts(req, res);
  }

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...response } = await this.authService.register(dto);

    return new UserDto(response.user);
  }

  @Get("register/check")
  async registerCheck(@Req() req: Request) {
    console.log(req.cookies);
    return this.authService.registerCheck(req);
  }

  @Post("register/completion")
  async registerCompletion(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RegisterCompletionDto,
  ) {
    return this.authService.registerCompletion(req, res, body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.setRefreshTokenToCookies(res, refreshToken);
    return new ResponseDto({
      accessToken: response.accessToken,
      user: new UserDto(response.user),
    });
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromCookies(res);
    return true;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    // ts-ignore
    const email = req.user.email;
    console.log(req.user.email, "check");

    const user = await this.userService.findByEmail(email);
    if (user) {
      const { refreshToken, ...response } =
        await this.authService.loginWithSocial(user);
      this.authService.setRefreshTokenToCookies(res, refreshToken);
      return res.redirect(`${process.env.CLIENT_URL}/`);
    }
    return this.authService.registerWithSocial(req, res);
  }

  @Get("yandex")
  @UseGuards(AuthGuard("yandex"))
  async yandexAuth(@Req() req) {}

  @Get("yandex/callback")
  @UseGuards(AuthGuard("yandex"))
  async yandexAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req);

    this.authService.setRefreshTokenToCookies(res, refreshToken);

    return res.redirect(
      `http://localhost:3000?accessToken=${response.accessToken}`,
    );
  }

  @Get("refresh-token")
  async refreshToken(
    @Cookies("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    this.authService.setRefreshTokenToCookies(res, tokens.refreshToken);
    res.status(200).json({ accessToken: tokens.accessToken });
  }
}
