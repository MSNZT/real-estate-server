import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetOrCreateLocationDto {
  @IsNumber({}, { message: "Поле latitude не может быть пустым" })
  latitude: number;

  @IsNumber({}, { message: "Поле longitude не может быть пустым" })
  longitude: number;

  @IsNotEmpty({ message: "Поле city не может быть пустым" })
  @IsString({ message: "Поле city обязательно для заполнения" })
  city: string;

  @IsNotEmpty({ message: "Поле address не может быть пустым" })
  @IsString({ message: "Поле address обязательно для заполнения" })
  address: string;
}
