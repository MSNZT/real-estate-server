import { Field, InputType, PartialType } from "@nestjs/graphql";
import { DealInput, LocationDto, PropertyDetailsInput } from "./createAdInput";
import { AdTypes, PropertyTypes } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

@InputType()
class UpdatePropertyDetailsInput extends PartialType(PropertyDetailsInput) {}

@InputType()
class UpdateDealInput extends PartialType(DealInput) {}

@InputType()
export class UpdateAdInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  mainPhoto?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @Field(() => AdTypes, { nullable: true })
  @IsOptional()
  @IsEnum(AdTypes)
  adType?: AdTypes;

  @Field(() => PropertyTypes, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyTypes)
  propertyType?: PropertyTypes;

  @Field(() => LocationDto, { nullable: true })
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @Field(() => UpdateDealInput, { nullable: true })
  @ValidateNested()
  @Type(() => UpdateDealInput)
  deal?: UpdateDealInput;

  @Field(() => UpdatePropertyDetailsInput, { nullable: true })
  @ValidateNested()
  @Type(() => UpdatePropertyDetailsInput)
  propertyDetails?: UpdatePropertyDetailsInput;
}
