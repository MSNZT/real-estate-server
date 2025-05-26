import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  Logger,
} from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { ValidationError } from "class-validator";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    this.logger.error(`Exception: ${exception.message}`, exception.stack);

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      return this.handleValidationError(response);
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return new GraphQLError("Validation failed", {
        extensions: {
          code: "BAD_REQUEST",
          response: {
            message: "Validation failed",
            errors: response, // Передаем объект с ошибками
          },
        },
      });
    }

    // Обработка других ошибок
    return new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }

  private handleValidationError(response: any) {
    const errors = this.formatValidationErrors(response);

    return new GraphQLError("Validation failed", {
      extensions: {
        code: "BAD_REQUEST",
        statusCode: 400,
        errors,
      },
    });
  }

  private formatValidationErrors(errors: any) {
    if (!Array.isArray(errors?.error)) {
      return errors || [];
    }
    return errors.error.map((err: ValidationError) => ({
      field: err.property,
      message: Object.values(err.constraints || {})[0] || "Invalid value",
    }));
  }
}
