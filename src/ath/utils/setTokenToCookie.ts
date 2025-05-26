import { ConfigService } from "@nestjs/config";
import { Response } from "express";

export function setTokenToCookie(
  res: Response,
  name: string,
  token: string,
  expires: Date,
  configService: ConfigService,
) {
  res.cookie(name, token, {
    expires,
    secure: configService.getOrThrow("NODE_ENV") === "production",
    httpOnly: true,
    sameSite: "lax",
  });
}
