import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class HouseFieldsInput {
  @Expose()
  @IsNumber({}, { message: "Поле plotArea не может быть пустым" })
  plotArea: number;

  @Expose()
  @IsNumber({}, { message: 'Поле "plotHouse" должно быть числом' })
  plotHouse: number;

  @Expose()
  @IsString({ message: "Поле areaType не может быть пустым" })
  areaType: string;

  @Expose()
  @IsNumber({}, { message: "Поле floor не может быть пустым" })
  floor: number;

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
