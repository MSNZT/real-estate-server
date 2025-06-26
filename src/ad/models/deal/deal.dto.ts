import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class RentShortDealFieldsModel {
  @IsNumber({}, { message: "Поле deposit не может быть пустым" })
  @IsPositive({ message: "Значение должно быть положительным" })
  deposit: number;
}

export class RentLongDealFieldsModel {
  @IsNumber({}, { message: "Поле deposit не может быть пустым" })
  @IsPositive({ message: "Значение должно быть положительным" })
  deposit: number;

  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле deposit не может быть пустым" })
  agentFee: number;

  @IsString({ message: "Поле bargain обязательно для заполнения" })
  @IsNotEmpty({ message: "Поле bargain не может быть пустым" })
  utilitiesFee: string;
}

export class SellDealFieldsModel {
  @IsBoolean({ message: "Поле bargain должно содержать булево значение" })
  bargain: boolean;

  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле deposit не может быть пустым" })
  agentFee: number;
}
