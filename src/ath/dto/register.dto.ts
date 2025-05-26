import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IsPhoneNumber } from "../validators/IsPhoneNumber";
import { EmailDto } from "./base.dto";

export class RegisterDto extends EmailDto {
  @IsString({ message: "Укажите имя" })
  name: string;

  @IsString({
    message: "Номер телефона должен быть строкой",
  })
  @IsPhoneNumber({ message: "Укажите номер телефона в формате 79123456789" })
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: "Минимальная длина пароля 6 символов" })
  @MaxLength(20, { message: "Максимальная длина пароля 20 символов" })
  password?: string;
}
