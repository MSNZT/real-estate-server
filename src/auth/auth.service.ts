import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { compareSync } from "bcrypt";
import { Response, Request } from "express";
import { UsersService } from "src/users/users.service";
import { LoginDto, RegisterDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async checkAuth(req: Request) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) return false;
    try {
      const token = accessToken.split(" ")[1];
      await this.jwt.verifyAsync(token);
      return true;
    } catch (e) {
      console.log(e, "Ошибка проверки авторизации - checkAuth");
      return false;
    }
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.usersService.findByIdOrEmail(dto.email);
    if (oldUser) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    const user = await this.usersService.create(dto);
    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByIdOrEmail(dto.email);

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async validateOAuthLogin(req: any) {
    let user = await this.usersService.findByIdOrEmail(req.user.email);

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.picture,
        },
      });
    }

    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const userId = this.jwt.verify(refreshToken).id;
    const user = await this.usersService.findByIdOrEmail(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateToken(user);
  }

  generateToken(user: User) {
    const data = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    const refreshToken = this.jwt.sign(
      { id: data.id },
      {
        expiresIn: "30d",
        secret: this.configService.get("JWT_SECRET"),
      },
    );

    const accessToken = this.jwt.sign(data, {
      secret: this.configService.get("JWT_SECRET"),
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  setRefreshTokenToCookies(res: Response, refreshToken: string) {
    const expiresIn = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: false,
      sameSite: "lax",
    });
  }

  removeRefreshTokenFromCookies(res: Response) {
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
  }
}
