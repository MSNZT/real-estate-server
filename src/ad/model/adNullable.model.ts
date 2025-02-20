import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AdTypes, PropertyDealTypes, PropertyTypes } from "@prisma/client";
import { Location } from "./location.model";
import { Owner } from "./owner.model";
import { RentHouse } from "./ad.model";
import { BookingModel } from "./booking.model";

@ObjectType()
export class AdNullable {
  @Field(() => String, { nullable: true }) // теперь id nullable
  id: string;

  @Field(() => String, { nullable: true }) // теперь description nullable
  description: string;

  @Field(() => Int, { nullable: true }) // price может быть null
  price: number;

  @Field(() => String, { nullable: true }) // mainPhoto может быть null
  mainPhoto: string;

  @Field(() => [String], { nullable: true }) // photos могут быть null
  photos: string[];

  @Field(() => AdTypes, { nullable: true }) // adType nullable
  adType: AdTypes;

  @Field(() => PropertyTypes, { nullable: true }) // propertyType nullable
  propertyType: PropertyTypes;

  @Field(() => PropertyDealTypes, { nullable: true }) // propertyDeal nullable
  propertyDeal: PropertyDealTypes;

  @Field(() => Location, { nullable: true }) // location nullable
  location: Location;

  @Field(() => Owner, { nullable: true }) // owner nullable
  owner: Owner;

  @Field(() => RentHouse, { nullable: true }) // details nullable
  details?: RentHouse;

  @Field(() => [BookingModel], { nullable: true }) // booking nullable
  booking?: BookingModel[];

  @Field(() => Date, { nullable: true }) // createdAt nullable
  createdAt: Date;

  @Field(() => Date, { nullable: true }) // updatedAt nullable
  updatedAt: Date;
}
