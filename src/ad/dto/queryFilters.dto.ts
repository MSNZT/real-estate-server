import { Field, InputType, Int } from "@nestjs/graphql";
import { AdTypes, PropertyTypes } from "@prisma/client";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import GraphQLJSON from "graphql-type-json";
import { PriceScalar } from "@/ad/dto/price";

@InputType()
class PriceFilter {
  @Field(() => Int)
  @IsOptional()
  from?: number;

  @Field(() => Int)
  @IsOptional()
  to?: number;
}

@InputType()
export class PropertyDetailsFilter {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  fields?: Record<string, any>;
}

@InputType()
export class DealFilter {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  fields?: Record<string, any>;

  @Field(() => PriceFilter, { nullable: true })
  @IsOptional()
  price?: PriceFilter;
}

@InputType()
export class AdFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AdTypes, {
    message: `adType должен содержать один из вариантов: (${Object.values(AdTypes).join(", ")})`,
  })
  @Transform(({ value }) => value?.toLowerCase())
  adType: AdTypes;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(PropertyTypes, {
    message: `propertyType должен содержать один из вариантов: (${Object.values(PropertyTypes).join(", ")})`,
  })
  @Transform(({ value }) => value?.toLowerCase())
  propertyType: PropertyTypes;

  @Field(() => PropertyDetailsFilter, { nullable: true })
  @Type(() => PropertyDetailsFilter)
  @ValidateNested()
  @IsOptional()
  propertyDetails?: PropertyDetailsFilter;

  @Field(() => DealFilter, { nullable: true })
  @Type(() => DealFilter)
  @ValidateNested()
  @IsOptional()
  deal?: DealFilter;

  @Field({ nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number = 1;

  @Field({ nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number = 20;
}
