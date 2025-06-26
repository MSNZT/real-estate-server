import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { Expose } from "class-transformer";

export class ApartmentFieldsInput {
  @Expose()
  @IsNotEmpty({ message: "Поле rooms не может быть пустым" })
  @IsString({ message: "Поле rooms обязательно для заполнения" })
  rooms: string;

  @Expose()
  @IsNotEmpty({ message: "Поле bathroom не может быть пустым" })
  @IsString({ message: "Поле bathroom обязательно для заполнения" })
  bathroom: string;

  @Expose()
  @IsNotEmpty({ message: "Поле renovation не может быть пустым" })
  @IsString({ message: "Поле renovation обязательно для заполнения" })
  renovation: string;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле ceilingHeight обязательно для заполнения" })
  ceilingHeight: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле totalArea обязательно для заполнения" })
  totalArea: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле livingArea обязательно для заполнения" })
  livingArea: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле kitchenArea обязательно для заполнения" })
  kitchenArea: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsInt({ message: "Поле floor не может быть пустым" })
  floor: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsInt({ message: "Поле floor не может быть пустым" })
  totalFloor: number;

  @Expose()
  @IsOptional()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsInt({ message: "Поле yearBuilt должно быть числом" })
  yearBuilt?: number;

  @Expose()
  @IsNotEmpty({ message: "Поле parkingType не может быть пустым" })
  @IsString({ message: "Поле floor не может быть пустым" })
  parkingType: string;
}
