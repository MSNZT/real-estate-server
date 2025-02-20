import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class RentApartment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  rooms: string;

  @Field(() => String)
  bathroom: string;

  @Field(() => String)
  renovation: string;

  @Field(() => Int)
  ceilingHeight: number;

  @Field(() => Int)
  totalArea: number;

  @Field(() => Int)
  livingArea: number;

  @Field(() => Int)
  kitchenArea: number;

  @Field(() => Int)
  floor: number;

  @Field(() => Int)
  totalFloor: number;

  @Field(() => Int, { nullable: true })
  yearBuilt?: number;

  @Field(() => String)
  parkingType: string;

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
