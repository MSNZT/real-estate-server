import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { GqlArgumentsHost } from "@nestjs/graphql";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();

    // Логируем исключение
    console.error(
      "Exception caught:",
      exception.response.errors.map((err) => err),
    );

    if (exception.response) {
      return {
        message: exception.response.message || "Validation error",
        errors: exception.response.errors || [],
        code: exception.response.error || "BAD_REQUEST",
        statusCode: exception.response.statusCode || 400,
      };
    }

    return {
      message: exception.message || "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    };
  }
}
