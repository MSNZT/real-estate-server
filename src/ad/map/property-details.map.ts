import { plainToInstance } from "class-transformer";
import { Prisma, PropertyTypes } from "@prisma/client";
import { HouseFieldsInput } from "../dto/real-property/house.dto";
import { ApartmentFieldsInput } from "../dto/real-property/apartment.dto";

export const mapPropertyDetailsFields = <T>(
  type: PropertyTypes,
  fields: Prisma.JsonValue,
): T => {
  if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
    throw new Error("PropertyDetails fields должен быть объектом");
  }
  switch (type) {
    case PropertyTypes.apartment: {
      return plainToInstance(ApartmentFieldsInput, fields, {}) as T;
    }
    case PropertyTypes.house: {
      return plainToInstance(HouseFieldsInput, fields) as T;
    }
    default:
      throw new Error("Неизвестный тип недвижимости");
  }
};
