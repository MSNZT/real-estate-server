import { IsNotEmpty, IsString } from "class-validator";

export class ComputeCityDto {
  @IsNotEmpty({ message: "Поле ip не может быть пустым" })
  @IsString({ message: "Поле ip обязательно для заполнения" })
  ip: string;
}
