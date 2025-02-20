import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertyDealTypes } from "@prisma/client";

@ObjectType()
export class RentHouseFields {
  @Field(() => Int)
  plotArea: number;

  @Field(() => Int)
  plotHouse: number;

  @Field(() => String)
  areaType: string;

  @Field(() => Int)
  floor: number;

  @Field(() => String)
  houseType: string;

  @Field(() => String)
  houseMaterialType: string;

  @Field(() => String)
  toilet: string;

  @Field(() => String)
  shower: string;

  @Field(() => String)
  bargain: string;

  @Field(() => String)
  deposit: string;

  @Field(() => String, { nullable: true })
  agentFee?: string;

  @Field(() => String, { nullable: true })
  utilities?: string;

  @Field(() => String)
  adId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class RentHouse {
  @Field(() => String)
  id: string;

  @Field(() => PropertyDealTypes)
  propertyDeal: PropertyDealTypes;

  @Field(() => String)
  fields: string;
}
