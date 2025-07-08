import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { AdTypes, PropertyTypes } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import GraphQLJSON from "graphql-type-json";

registerEnumType(AdTypes, {
  name: "AdTypes",
});

registerEnumType(PropertyTypes, {
  name: "PropertyTypes",
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
  @IsString({ message: "Поле адрес не может быть пустым" })
  address: string;
}

@InputType()
export class ContactInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  phone: string;

  @Field(() => String)
  @IsString()
  communication: string;
}

@InputType()
export class DealInput {
  @Field(() => Number)
  @IsNumber()
  price: number;

  @Field(() => GraphQLJSON)
  @ValidateIf(() => false)
  fields: object;
}

@InputType()
export class PropertyDetailsInput {
  @Field(() => GraphQLJSON)
  @ValidateIf(() => false)
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
  @IsNotEmpty({ message: "Поле title не может быть пустым" })
  @MinLength(8, { message: "Минимальное количество символов 8" })
  @IsString({ message: "Поле title обязательно для заполнения" })
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
  @IsNotEmpty({ message: "Поле description не может быть пустым" })
  @MinLength(30, { message: "Минимальное количество символов 30" })
  @IsString({ message: "Поле description обязательно для заполнения" })
  description: string;

  @Field(() => [String])
  @IsArray({ message: "Поле features должен быть массивом" })
  @ArrayNotEmpty({ message: "Массив features не может быть пустым" })
  @IsString({ each: true })
  features: string[];

  @Field(() => String)
  @IsNotEmpty({ message: "Поле mainPhoto не может быть пустым" })
  @IsString({ message: "Поле mainPhoto обязательно для заполнения" })
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
