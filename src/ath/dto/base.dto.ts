import { IsEmail, IsString } from "class-validator";

export class EmailDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsEmail({}, { message: "Неверно указан формат почты" })
  email: string;
}
