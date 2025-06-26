import { AdTypes, Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import {
  RentLongDealFieldsModel,
  RentShortDealFieldsModel,
  SellDealFieldsModel,
} from "../models/deal/deal.dto";

export const mapDealFields = <T>(
  adType: AdTypes,
  fields: Prisma.JsonValue,
): T => {
  if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
    throw new Error("Deal fields должен быть объектом");
  }
  switch (adType) {
    case AdTypes.rent_long: {
      return plainToInstance(RentLongDealFieldsModel, fields) as T;
    }
    case AdTypes.rent_short: {
      return plainToInstance(RentShortDealFieldsModel, fields) as T;
    }
    case AdTypes.sell: {
      return plainToInstance(SellDealFieldsModel, fields) as T;
    }
    default:
      throw new Error("Неизвестный тип объявления");
  }
};
