import { IsDate, IsString, MaxLength, MinLength } from "class-validator";
import { EmailDto } from "./base.dto";

export class ResetPasswordDto extends EmailDto {
  @MinLength(6, { message: "Минимальная длина пароля 6 символов" })
  @MaxLength(20, { message: "Максимальная длина пароля 20 символов" })
  @IsString({ message: "Пароль должен быть строкой" })
  password: string;

  @IsString({ message: "Введите код восстановленич" })
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ResetPasswordCodeDto {
  @IsString()
  resetPasswordCode: string;
  @IsDate()
  resetPasswordExpires: Date;
}

export class ValidateCodeDto extends EmailDto {
  @IsString({ message: "Введите код восстановленич" })
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
