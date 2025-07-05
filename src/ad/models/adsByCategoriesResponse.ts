import { Field, ObjectType } from "@nestjs/graphql";
import { Ad } from "./ad.model";
import { AdTypes, PropertyTypes } from "@prisma/client";

@ObjectType()
export class AdsByCategories {
  @Field(() => AdTypes)
  adType: AdTypes;
  @Field(() => PropertyTypes)
  propertyType: PropertyTypes;
  @Field(() => [Ad])
  ads: Ad[];
}
