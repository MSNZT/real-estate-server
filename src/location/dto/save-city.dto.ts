import { Validate } from "class-validator";
import { IsStringOrIsBoolean } from "../validator/stringOrBoolean.validator";

export class SaveCityDto {
  @Validate(IsStringOrIsBoolean)
  city: string | boolean;
}
