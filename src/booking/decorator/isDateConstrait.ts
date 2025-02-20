import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsDateDMYConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments): boolean {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(date)) {
      (args.object as any)[`${args.property}_messageType`] = "format";
      return false;
    }

    const [day, month, year] = date.split("/").map(Number);
    const currentDate = new Date();

    if (year < currentDate.getFullYear()) {
      (args.object as any)[`${args.property}_messageType`] = "year";
      return false;
    }

    if (
      year === currentDate.getFullYear() &&
      month - 1 < currentDate.getMonth()
    ) {
      (args.object as any)[`${args.property}_messageType`] = "month";
      return false;
    }

    if (
      year === currentDate.getFullYear() &&
      month - 1 === currentDate.getMonth() &&
      day < currentDate.getDate()
    ) {
      (args.object as any)[`${args.property}_messageType`] = "day";
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const messageType = (args.object as any)[`${args.property}_messageType`];

    if (messageType === "format") {
      return "Дата должна быть в формате день/месяц/год";
    }

    if (messageType === "year") {
      return "Год даты должен быть больше или равен текущему году";
    }

    if (messageType === "month") {
      return "Месяц даты должен быть больше или равен текущему месяцу";
    }

    if (messageType === "day") {
      return "День даты должен быть больше или равен текущему дню";
    }

    return "Дата некорректна";
  }
}
