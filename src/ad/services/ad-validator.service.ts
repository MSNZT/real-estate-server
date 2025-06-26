import { Injectable, Logger } from "@nestjs/common";
import { AdTypes, Prisma, PropertyTypes } from "@prisma/client";
import { Ad } from "../models/ad.model";
import { validateOrReject } from "class-validator";
import { DealInput } from "../dto/create-ad.input";
import { DealFieldsType, RealPropertyDetailsType } from "../types/types";
import { mapPropertyDetailsFields } from "../map/property-details.map";
import { mapDealFields } from "../map/deal.map";

@Injectable()
export class AdValidatorService {
  private logger = new Logger();

  async validatePropertyDetailsFields(
    propertyType: PropertyTypes,
    propertyDetails: Ad["propertyDetails"],
  ) {
    try {
      const propertyDetailsInstance: RealPropertyDetailsType =
        mapPropertyDetailsFields(propertyType, propertyDetails.fields);
      await validateOrReject(propertyDetailsInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      return propertyDetailsInstance as unknown as Prisma.InputJsonValue;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async validateDeal(adType: AdTypes, deal: DealInput) {
    try {
      const dealFieldsInstance: DealFieldsType = mapDealFields(
        adType,
        deal.fields,
      );
      await validateOrReject(dealFieldsInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      return {
        fields: dealFieldsInstance as unknown as Prisma.InputJsonValue,
        price: deal.price,
      };
    } catch (error) {
      console.log("Проблема");
      this.logger.error(error);
      throw error;
    }
  }
}
