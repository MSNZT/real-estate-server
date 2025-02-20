import { Catch, UnauthorizedException } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements GqlExceptionFilter {
  catch(exception: UnauthorizedException) {
    return new GraphQLError(exception.message, {
      extensions: {
        code: "UNAUTHENTICATED",
        statusCode: 401,
        originalError: {
          message: exception.message,
          statusCode: 401,
        },
      },
    });
  }
}
