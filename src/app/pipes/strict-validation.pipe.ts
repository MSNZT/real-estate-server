import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from "@nestjs/common";
import { validateOrReject, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Logger } from "winston";

@Injectable()
export class StrictValidationPipe implements PipeTransform<any> {
  constructor(private readonly logger: Logger) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    try {
      await validateOrReject(object, {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      });

      return object;
    } catch (errors) {
      console.error(JSON.stringify(errors, null, 2));
      this.logValidationErrors(errors as ValidationError[]);
      throw new BadRequestException("Validation failed");
    }
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private logValidationErrors(errors: ValidationError[], request?: any): void {
    for (const error of errors) {
      const propertyName = error.property;

      if (error.constraints) {
        for (const constraint in error.constraints) {
          this.logger.warn(error.constraints[constraint], {
            property: propertyName,
            url: request?.url || "unknown",
            method: request?.method || "unknown",
            ip: request?.ip || "unknown",
          });
        }
      }

      if (error.children?.length > 0) {
        this.logValidationErrors(error.children, request);
      }
    }
  }
}
