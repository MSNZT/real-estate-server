import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString({ message: "Почта обязательна для заполнения" })
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(4, { message: "Минимальная длина пароля 4 символа" })
  @IsString()
  password: string;

  @IsString({ message: "Имя обязательно для заполнения" })
  name: string;

  @IsString({ message: "Номер телефона обязательно для заполнения" })
  phone: string;
}

export class RegisterCompletionDto {
  @IsString({ message: "Номер телефона обязательно для заполнения" })
  phone: string;
}
