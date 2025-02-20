import { IsBoolean, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class DealFieldsDto {
  @Expose()
  @IsBoolean({ message: "Поле bargain не может быть пустым" })
  bargain: boolean;

  @Expose()
  @IsString({ message: "Поле deposit не может быть пустым" })
  deposit: number;

  @Expose()
  @IsString({ message: "Поле agentFee не может быть пустым" })
  agentFee: number;

  @Expose()
  @IsString({ message: "Поле utilities не может быть пустым" })
  utilities: number;
}
