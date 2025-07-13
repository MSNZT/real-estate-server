import { IsString } from "class-validator";
import { EmailDto } from "./base.dto";

export class LoginDto extends EmailDto {
  @IsString({ message: "Укажите пароль" })
  password: string;
}
