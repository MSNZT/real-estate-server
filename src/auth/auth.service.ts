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
import { LoginDto, RegisterCompletionDto, RegisterDto } from "./dto";
import { AccountsDto, UserDto } from "./dto/response";
import { UserService } from "@/user/user.service";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UserService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async accounts(req: Request, res: Response) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) return false;
    try {
      const token = accessToken.split(" ")[1];
      const authData = await this.jwt.verifyAsync(token);
      const user = await this.usersService.findByEmail(authData.email);
      return new AccountsDto({ ...user, phone: "+79238762938" });
    } catch (e) {
      console.log(e, "Ошибка проверки авторизации - checkAuth");
      this.removeRefreshTokenFromCookies(res);
      return false;
    }
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.usersService.findByEmail(dto.email);
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

  registerWithSocial(req: any, res: Response) {
    const registerToken = this.jwt.sign(
      {
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
      },
      { expiresIn: "10m" },
    );

    const maxAge = 10 * 60 * 1000;
    res.cookie("registerToken", registerToken, {
      httpOnly: true,
      maxAge,
      secure: false,
      sameSite: "lax",
    });

    return res.redirect(`${process.env.CLIENT_URL}/auth/register/completion`);
  }

  async registerCheck(req: Request) {
    try {
      const registerToken = req.cookies["registerToken"];

      if (registerToken) {
        await this.verifyToken(registerToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async registerCompletion(
    req: Request,
    res: Response,
    dto: RegisterCompletionDto,
  ) {
    try {
      const registerToken = req.cookies["registerToken"];
      console.log("phone", dto);

      if (registerToken) {
        const data = await this.verifyToken(registerToken);
        await this.register({
          ...data,
          ...dto,
        });

        res.cookie("registerToken", "", {
          httpOnly: true,
          expires: new Date(0),
          secure: true,
          sameSite: "none",
        });
      }
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException("Ошибка при регистрации");
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async loginWithSocial(dto: any) {
    const user = await this.usersService.findByEmail(dto.email);
    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async validateOAuthLogin(req: any) {
    let user = await this.usersService.findByEmail(req.user.email);

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.picture,
          phone: null,
        },
      });
    }

    const tokens = this.generateToken(user);

    return {
      user,
      ...tokens,
    };
  }

  async verifyToken(token: string) {
    return await this.jwt.verifyAsync(token);
  }

  async refreshToken(refreshToken: string) {
    const email = this.jwt.verify(refreshToken).email;
    const user = await this.usersService.findByEmail(email);

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
