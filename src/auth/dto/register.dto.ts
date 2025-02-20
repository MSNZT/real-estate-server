import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString({ message: "Почта обязательна для заполнения" })
  @IsEmail()
  email: string;

  @MinLength(4, { message: "Минимальная длина пароля 4 символа" })
  @IsString({ message: "Поле пароль обязательно для заполнения" })
  password: string;

  @IsString({ message: "Имя обязательно для заполнения" })
  name: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
