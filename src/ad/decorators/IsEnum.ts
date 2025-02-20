import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsEnumCustomConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [enumObj] = args.constraints;
    return Object.values(enumObj).includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [enumObj] = args.constraints;
    return `${args.property} must be one of the following values: ${Object.values(enumObj).join(", ")}`;
  }
}

export function IsEnumCustom(
  enumObj: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObj],
      validator: IsEnumCustomConstraint,
    });
  };
}
