// import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// import { Request } from "express";
//
// export const CurrentUser = createParamDecorator(
//   (data: any, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest() as Request;
//     return request.user;
//   },
// );

// import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// import { GqlExecutionContext } from "@nestjs/graphql";
// import { Request } from "express";
//
// export const CurrentUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const ctx = GqlExecutionContext.create(context);
//     const request = ctx.getContext().req as Request;
//     return request.user;
//   },
// );

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.user;
  },
);
