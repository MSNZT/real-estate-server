import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Неверный формат почты" })
  email: string;

  @IsString({ message: "Поле пароль не может быть пустым" })
  password: string;
}
