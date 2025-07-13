import { ConfigModule, ConfigService } from "@nestjs/config";

export const jwtConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow("JWT_SECRET"),
  }),
  inject: [ConfigService],
};
