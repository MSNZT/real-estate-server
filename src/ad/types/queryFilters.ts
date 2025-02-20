import { AdTypes, PropertyTypes } from "@prisma/client";

export type QueryFilters = {
  adType: AdTypes;
  propertyType: PropertyTypes;
  page?: number;
  limit?: number;
};
