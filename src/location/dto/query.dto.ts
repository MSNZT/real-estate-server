import { IsNotEmpty, IsString } from "class-validator";

export class QueryDto {
  @IsString({ message: "Поле query обязательно для заполнения" })
  @IsNotEmpty({ message: "Поле query не может быть пустым" })
  query: string;
}
