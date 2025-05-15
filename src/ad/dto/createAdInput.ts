import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { AdTypes, PropertyDealTypes, PropertyTypes } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { PriceScalar } from "./price";
import { GraphQLJSONObject } from "graphql-type-json";

registerEnumType(AdTypes, {
  name: "AdTypes",
});

registerEnumType(PropertyTypes, {
  name: "PropertyTypes",
});

registerEnumType(PropertyDealTypes, {
  name: "PropertyDealTypes",
});

@InputType()
export class LocationDto {
  @Field(() => Number)
  @IsNumber()
  latitude: number;

  @Field(() => Number)
  @IsNumber()
  longitude: number;

  @Field(() => String)
  @IsString({ message: "Поле город не может быть пустым" })
  city: string;

  @Field(() => String)
  @IsString({ message: "Поле улица не может быть пустым" })
  street: string;
}

@InputType()
export class DealInput {
  @Field(() => PriceScalar)
  @IsNumber()
  price: number;

  @Field(() => GraphQLJSONObject)
  fields: object;
}

@InputType()
export class ContactInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  communication: string;
}

@InputType()
export class PropertyDetailsInput {
  @Field(() => GraphQLJSONObject)
  @ValidateNested()
  fields: object;
}

@InputType()
export class CreateAdInput {
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
  title: string;

  @Field(() => PropertyDetailsInput)
  @Type(() => PropertyDetailsInput)
  @ValidateNested()
  propertyDetails: PropertyDetailsInput;

  @Field(() => DealInput)
  @Type(() => DealInput)
  @ValidateNested()
  deal: DealInput;

  @Field(() => ContactInput)
  @Type(() => ContactInput)
  @ValidateNested()
  contact: ContactInput;

  @Field(() => String)
  @IsNotEmpty({ message: "Поле описание не может быть пустым" })
  @MinLength(50, { message: "Минимальное количество символов 50" })
  @IsString()
  description: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

  @Field(() => String)
  @IsNotEmpty({ message: "Поле mainPhoto не может быть пустым" })
  @IsString()
  mainPhoto: string;

  @Field(() => [String])
  @ArrayNotEmpty({
    message: "В поле photos необходимо добавить хотя бы 1 фотографию",
  })
  @IsArray({ message: "Поле photos должно быть массивом фотографий" })
  @IsString({
    each: true,
    message: "Каждый элемент в поле mainPhoto должен быть строкой",
  })
  photos: string[];

  @Field(() => LocationDto)
  @Type(() => LocationDto)
  @ValidateNested()
  location: LocationDto;
}
