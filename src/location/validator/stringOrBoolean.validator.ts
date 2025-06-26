import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isStringOrBoolean", async: false })
export class IsStringOrIsBoolean implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return (
      (value !== undefined && typeof value === "boolean") ||
      typeof value === "string"
    );
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Поле city должен быть строкой или булевым значением";
  }
}
