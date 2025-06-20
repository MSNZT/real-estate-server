import { UserService } from "@/user/user.service";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { compareSync } from "bcrypt";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@/mail/mail.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthTokenPayload, TokensResponse } from "../types/token.types";
import { EmailDto } from "../dto/base.dto";
import { ResetPasswordDto, ValidateCodeDto } from "../dto/reset-password.dto";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(
          "Пользователь с таким email уже существует",
        );
      }
      const user = await this.userService.create(dto);
      return user;
    } catch (error) {
      console.log(error);
      if (error.status && error.status === 409) {
        throw error;
      }
      throw new BadRequestException(
        "Произошла неизвестная ошибка при регистрации",
      );
    }
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: TokensResponse }> {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);
      if (
        !existingUser ||
        !existingUser.password ||
        !compareSync(dto.password, existingUser.password)
      ) {
        throw new UnauthorizedException("Неверный email или пароль");
      }
      const tokens = await this.generateUserTokens(existingUser);
      return {
        user: existingUser,
        tokens,
      };
    } catch (error) {
      this.logger.error("Ошибка при авторизации", error);
      if (error.status && error.status === 401) {
        throw error;
      }
      throw new BadRequestException("Неизвестная ошибка при авторизации");
    }
  }

  async getMe(email: User["email"]) {
    try {
      const user = await this.userService.findByEmail(email);
      return user;
    } catch (error) {
      this.logger.error("Пользователь не авторизован", error);
      throw new UnauthorizedException("Не авторизован");
    }
  }

  async forgetPassword(dto: EmailDto) {
    try {
      const user = await this.userService.findByEmail(dto.email);
      if (user) {
        const code = randomInt(100000, 999999).toString();

        await this.userService.updateUser(user.email, {
          resetPasswordCode: code,
          resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000),
        });
        await this.mailService.sendResetPassword(user.email, code);
      }
      const domain = dto.email.split("@")[1];
      return {
        status: "complete",
        message:
          "Если пользователь существует, мы отправим 6-значный код для сброса пароля на почтовый ящик. Письмо может попасть в спам.",
        domain,
      };
    } catch (error) {
      this.logger.error("Password reset error", error);
      console.log(error);
      throw new InternalServerErrorException(
        "Произошла ошибка при обработке запроса",
      );
    }
  }

  async validateForgetPasswordCode(dto: ValidateCodeDto) {
    try {
      const { email, code } = dto;
      await this.verifyResetCode(email, code);
      return { status: "success" };
    } catch (error) {
      this.logger.error("Ошибка при валидации reset password code", error);
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const { email, code, password } = dto;
      await this.verifyResetCode(email, code);
      await this.userService.updateUser(email, {
        password,
        resetPasswordCode: null,
        resetPasswordExpires: null,
      });

      return {
        status: "success",
      };
    } catch (error) {
      this.logger.error("Произошла ошибка при сбросе пароля", error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokensResponse> {
    try {
      const payload =
        await this.jwtService.verifyAsync<AuthTokenPayload>(refreshToken);
      if (!payload) throw new UnauthorizedException("Нет доступа");
      return await this.generateUserTokens(payload);
    } catch (error) {}
  }

  async generateUserTokens(
    user: Pick<User, "email" | "name">,
  ): Promise<TokensResponse> {
    const payload = {
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow("JWT_EXP_ACCESS"),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow("JWT_EXP_REFRESH"),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyResetCode(email: string, code: string) {
    const user = await this.userService.findByEmail(email);

    console.log(code, user.resetPasswordCode);
    console.log("date", user.resetPasswordExpires < new Date());

    if (!user || user.resetPasswordCode !== code) {
      throw new BadRequestException("Неверный код восстановления");
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException("Срок действия кода истек");
    }
  }
}
