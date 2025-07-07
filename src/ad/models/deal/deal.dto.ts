import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class RentShortDealFieldsModel {
  @IsInt({ message: "Поле deposit не может быть пустым" })
  @Min(0, { message: "Значение должно быть положительным или нулём" })
  deposit: number;
}

export class RentLongDealFieldsModel {
  @IsInt({ message: "Поле deposit не может быть пустым" })
  @Min(0, { message: "Значение должно быть положительным или нулём" })
  deposit: number;

  @IsInt({ message: "Поле deposit не может быть пустым" })
  @Min(0, { message: "Значение должно быть положительным или нулём" })
  agentFee: number;

  @IsString({ message: "Поле bargain обязательно для заполнения" })
  @IsNotEmpty({ message: "Поле bargain не может быть пустым" })
  utilitiesFee: string;
}

export class SellDealFieldsModel {
  @IsBoolean({ message: "Поле bargain должно содержать булево значение" })
  bargain: boolean;
}
