import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Location {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => String)
  city: string;

  @Field(() => String)
  address: string;
}
