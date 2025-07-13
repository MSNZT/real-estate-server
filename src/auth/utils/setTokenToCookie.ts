import { ConfigService } from "@nestjs/config";
import { Response } from "express";

export function setTokenToCookie(
  res: Response,
  name: string,
  token: string,
  expires: Date,
  configService: ConfigService,
) {
  const isProduction = configService.getOrThrow("NODE_ENV") === "production";
  res.cookie(name, token, {
    expires,
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: isProduction
      ? new URL(this.configService.getOrThrow("CLIENT_URL")).hostname
      : undefined,
  });
}
