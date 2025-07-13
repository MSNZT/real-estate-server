import { ConfigService } from "@nestjs/config";
import { Response } from "express";

export function removeTokenFromCookie(
  res: Response,
  name: string,
  configService: ConfigService,
) {
  const isProduction = configService.getOrThrow("NODE_ENV") === "production";
  res.cookie(name, "", {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain: isProduction
      ? new URL(this.configService.getOrThrow("CLIENT_URL")).hostname
      : undefined,
  });
}
