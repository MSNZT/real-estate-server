import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";

export function AuthJwt() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
