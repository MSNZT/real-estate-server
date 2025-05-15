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
  @Field(() => Int, { nullable: true })
  @IsOptional()
  from?: number;

  @Field(() => Int, { nullable: true })
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
export class LocationFilter {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  fields?: Record<string, any>;

  @Field(() => String, { nullable: true })
  @IsOptional()
  city?: string;
}

@InputType()
export class AdFilterInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  ids: string[];

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

  @Field(() => LocationFilter, { nullable: true })
  @Type(() => LocationFilter)
  @ValidateNested()
  @IsOptional()
  location?: LocationFilter;

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
