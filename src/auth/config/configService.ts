import { ConfigService } from "@nestjs/config";

export const configService = (configService: ConfigService) => {
  return {
    secret: configService.get<string>("JWT_SECRET"),
    signOptions: {
      expiresIn: configService.get<string>("JWT_EXP"),
    },
  };
};
