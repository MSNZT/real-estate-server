import { HouseFieldsInput } from "../dto/propertyInput/house";
import { ApartmentFieldsInput } from "../dto/propertyInput/apartment";
import { ClassConstructor } from "class-transformer";
import { PropertyTypes } from "@prisma/client";

export const propertyTypeMap = new Map<PropertyTypes, ClassConstructor<object>>(
  [
    ["house", HouseFieldsInput],
    ["apartment", ApartmentFieldsInput],
  ],
);
