import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Location } from "./location.model";
import { Owner } from "./owner.model";
import { AdTypes, DurationRentTypes, PropertyTypes } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import { BookingModel } from "./booking.model";
import { IsNotEmpty } from "class-validator";

@ObjectType()
export class RentHouse {
  @Field(() => String)
  id: string;

  @Field(() => GraphQLJSON)
  fields: any;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Deal {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  price: number;

  @Field(() => GraphQLJSON)
  fields: any;

  @Field(() => DurationRentTypes, { nullable: true })
  durationRent: DurationRentTypes;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class PropertyDetails {
  @Field(() => GraphQLJSON)
  fields: any;
}

@ObjectType()
export class Ad {
  @Field(() => String)
  id: string;

  @Field()
  @IsNotEmpty({ message: "Поле description обязательно для заполнения" })
  description: string;

  @Field(() => String)
  mainPhoto: string;

  @Field(() => [String])
  photos: string[];

  @Field(() => AdTypes)
  adType: AdTypes;

  @Field(() => PropertyTypes)
  propertyType: PropertyTypes;

  @Field(() => Deal)
  deal: Deal;

  @Field(() => PropertyDetails)
  propertyDetails?: PropertyDetails;

  @Field(() => Location)
  location: Location;

  @Field(() => Owner)
  owner: Owner;

  @Field(() => [BookingModel])
  booking?: BookingModel[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
