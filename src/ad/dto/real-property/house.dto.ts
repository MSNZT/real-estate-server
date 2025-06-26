import { Expose } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class HouseFieldsInput {
  @Expose()
  @IsNumber({}, { message: "Поле plotArea не может быть пустым" })
  @IsPositive({ message: "Значение должно быть положительным" })
  plotArea: number;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: 'Поле "plotHouse" должно быть числом' })
  plotHouse: number;

  @Expose()
  @IsString({ message: "Поле areaType не может быть пустым" })
  areaType: string;

  @Expose()
  @IsPositive({ message: "Значение должно быть положительным" })
  @IsNumber({}, { message: "Поле totalFloor не может быть пустым" })
  totalFloor: number;

  @Expose()
  @IsString({ message: "Поле houseType не может быть пустым" })
  houseType: string;

  @Expose()
  @IsString({ message: "Поле houseMaterialType не может быть пустым" })
  houseMaterialType: string;

  @Expose()
  @IsString({ message: "Поле toilet не может быть пустым" })
  toilet: string;

  @Expose()
  @IsString({ message: "Поле shower не может быть пустым" })
  shower: string;
}
