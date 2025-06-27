import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { Request } from "express";

export const UUID = createParamDecorator((_, ctx: ExecutionContext) => {
  const id = ctx.switchToHttp().getRequest<Request>().params.id;
  if (isUUID(id)) {
    throw new BadRequestException("Неверный формат id");
  }
});
