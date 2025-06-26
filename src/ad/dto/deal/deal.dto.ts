import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class DealFieldsDto {
  @Expose()
  @IsOptional()
  @IsBoolean({ message: "Поле bargain должно содержать булево значение" })
  bargain: boolean;

  @Expose()
  @IsOptional()
  @IsString({ message: "Поле deposit должно быть числом" })
  deposit: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Поле agentFee должно быть числом" })
  agentFee: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "Поле utilities должно быть числом" })
  utilitiesFee: string;
}
