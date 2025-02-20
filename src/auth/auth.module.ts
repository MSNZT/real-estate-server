import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GUARDS } from "./guards";
import { STRATEGIES } from "./strategies";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXP"),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    PrismaService,
    UsersService,
    ...STRATEGIES,
    ...GUARDS,
  ],
})
export class AuthModule {}
