import { ValidationOptions, registerDecorator } from "class-validator";
import { IsDateDMYConstraint } from "./isDateConstrait";

export function IsDateDMY(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isDateDMY",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDateDMYConstraint,
    });
  };
}
