import { Field, ObjectType } from "@nestjs/graphql";
import { Ad } from "./ad.model";

@ObjectType()
export class AdsResponse {
  @Field(() => [Ad])
  ads: Ad[];

  @Field(() => Boolean)
  hasNextPage: boolean;
}
