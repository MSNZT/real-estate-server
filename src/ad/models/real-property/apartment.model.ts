import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class ApartmentFieldsModel {
  @Field(() => String)
  rooms: string;

  @Field(() => String)
  bathroom: string;

  @Field(() => String)
  renovation: string;

  @Field(() => Number)
  ceilingHeight: number;

  @Field(() => Number)
  totalArea: number;

  @Field(() => Number)
  livingArea: number;

  @Field(() => Number)
  kitchenArea: number;

  @Field(() => Int)
  floor: number;

  @Field(() => Int)
  totalFloor: number;

  @Field(() => Int, { nullable: true })
  yearBuilt?: number;

  @Field(() => String)
  parkingType: string;
}
