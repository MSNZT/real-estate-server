import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GUARDS } from "./guards";
import { STRATEGIES } from "./strategies";
import { configService } from "./config/configService";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: configService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    PrismaService,
    UserService,
    ...STRATEGIES,
    ...GUARDS,
  ],
})
export class AuthModule {}
