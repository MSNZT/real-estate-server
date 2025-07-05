import { IsNumber } from "class-validator";

export class CoordsDto {
  @IsNumber({}, { message: "Поле lat обязательно для заполнения" })
  lat: number;
  @IsNumber({}, { message: "Поле lat обязательно для заполнения" })
  lon: number;
}
