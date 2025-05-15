import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Location } from "./location.model";
import { Owner } from "./owner.model";
import { AdTypes, PropertyTypes } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import { BookingModel } from "./booking.model";
import { IsNotEmpty, IsOptional } from "class-validator";

@ObjectType()
export class AdContact {
  @Field(() => String)
  name: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String)
  communication: string;
}

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

  @Field(() => String)
  title: string;

  @Field()
  @IsNotEmpty({ message: "Поле description обязательно для заполнения" })
  description: string;

  @Field(() => String)
  mainPhoto: string;

  @Field(() => Number, { nullable: true })
  views?: number;

  @Field(() => [String])
  photos: string[];

  @Field(() => AdTypes)
  adType: AdTypes;

  @Field(() => PropertyTypes)
  propertyType: PropertyTypes;

  @Field(() => Deal)
  deal: Deal;

  @Field(() => AdContact)
  contact: AdContact;

  @Field(() => PropertyDetails)
  propertyDetails?: PropertyDetails;

  @Field(() => [String])
  features: string[];

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
