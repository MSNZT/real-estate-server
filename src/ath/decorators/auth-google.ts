import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export function AuthGoogle() {
  return applyDecorators(UseGuards(AuthGuard("google")));
}
