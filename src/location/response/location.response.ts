import { IsOptional, IsString } from "class-validator";

export class LocationResponse {
  @IsString()
  value: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city: string | null;

  @IsOptional()
  @IsString()
  settlement: string | null;

  @IsOptional()
  @IsString()
  geo_lat: string | null;

  @IsOptional()
  @IsString()
  geo_lon: string | null;

  @IsOptional()
  @IsString()
  street: string | null;

  @IsOptional()
  @IsString()
  house: string | null;
}
