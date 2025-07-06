import { ConfigService } from "@nestjs/config";
import { Response } from "express";

export function removeTokenFromCookie(
  res: Response,
  name: string,
  configService: ConfigService,
) {
  res.cookie(name, "", {
    httpOnly: true,
    expires: new Date(0),
    secure: configService.getOrThrow("NODE_ENV") === "production",
    sameSite: "none",
  });
}
