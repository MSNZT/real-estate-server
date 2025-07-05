import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { AdTypes, PropertyTypes } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

registerEnumType(AdTypes, {
  name: "AdTypes",
});

registerEnumType(PropertyTypes, {
  name: "PropertyTypes",
});

@InputType()
class AdCategoryFilterInput {
  @Field(() => String)
  @IsString()
  @IsEnum(AdTypes, {
    message: `adType должен содержать один из вариантов: (${Object.values(AdTypes).join(", ")})`,
  })
  @Transform(({ value }) => value?.toLowerCase())
  adType: AdTypes;

  @Field(() => String)
  @IsString()
  @IsEnum(PropertyTypes, {
    message: `propertyType должен содержать один из вариантов: (${Object.values(PropertyTypes).join(", ")})`,
  })
  @Transform(({ value }) => value?.toLowerCase())
  propertyType: PropertyTypes;

  @Field(() => String)
  @IsNotEmpty({ message: "Поле city не может быть пустым" })
  @IsString({ message: "Поле city обязательно для заполнения" })
  city: string;
}

@InputType()
export class AdsByCategoriesInput {
  @Field(() => [AdCategoryFilterInput])
  @ValidateNested({ each: true })
  @Type(() => AdCategoryFilterInput)
  categories: AdCategoryFilterInput[];

  @Field(() => Int)
  @IsInt({ message: "Поле limit обязательно для заполнения" })
  limit: number;
}
