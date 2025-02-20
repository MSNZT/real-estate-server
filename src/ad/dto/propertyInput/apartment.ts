import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class ApartmentFieldsInput {
  @Expose()
  @IsNotEmpty()
  @IsString()
  rooms: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  bathroom: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  renovation: string;

  @Expose()
  @IsInt()
  ceilingHeight: number;

  @Expose()
  @IsInt()
  totalArea: number;

  @Expose()
  @IsInt()
  livingArea: number;

  @Expose()
  @IsInt()
  kitchenArea: number;

  @Expose()
  @IsInt()
  floor: number;

  @Expose()
  @IsInt()
  totalFloor: number;

  @Expose()
  @IsInt()
  @IsOptional()
  yearBuilt?: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  parkingType: string;
}
