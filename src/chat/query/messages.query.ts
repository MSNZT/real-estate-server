import { IsOptional, IsString } from "class-validator";

export class QueryParams {
  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  cursor: string;
}
