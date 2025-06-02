import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as {
        statusCode: number;
        code: string;
        message: string;
      };

      response.status(exceptionResponse.statusCode).json({
        statusCode: exceptionResponse.statusCode,
        message: exceptionResponse.message,
      });
    }
  }
}
