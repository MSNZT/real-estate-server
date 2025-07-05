import { IsNumber, IsOptional, Validate } from "class-validator";
import { IsStringOrIsBoolean } from "../validator/stringOrBoolean.validator";

export class SaveLocationDto {
  @Validate(IsStringOrIsBoolean)
  city: string | boolean;

  @IsOptional()
  @IsNumber({}, { message: "Поле latitude должно быть числом" })
  latitude: number;

  @IsOptional()
  @IsNumber({}, { message: "Поле longitude должно быть числом" })
  longitude: number | null;
}
