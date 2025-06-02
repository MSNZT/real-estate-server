import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { ValidationError } from "class-validator";

interface IErrorResponse {
  message: string;
  code: string;
  statusCode: number;
  errors?: Record<string, any>[];
}

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    this.logger.error(`Exception: ${exception.message}`, exception.stack);

    const errorResponse = this.createErrorResponse(exception);

    console.log(exception);

    return new GraphQLError(errorResponse.message, {
      extensions: {
        code: errorResponse.code,
        statusCode: errorResponse.statusCode,
      },
    });
  }

  private createErrorResponse(exception: any): IErrorResponse {
    console.log(exception);

    return {
      message: exception.message,
      code: exception.response.error,
      statusCode: exception.response.statusCode,
    };
  }
}
