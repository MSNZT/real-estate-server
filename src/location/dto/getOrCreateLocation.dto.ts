import { IsNumber, IsString } from "class-validator";

export class GetOrCreateLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString({ message: "Поле город не может быть пустым" })
  city: string;

  @IsString({ message: "Поле адрес не может быть пустым" })
  address: string;
}
