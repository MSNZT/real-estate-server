import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export function AuthYandex() {
  return applyDecorators(UseGuards(AuthGuard("yandex")));
}
