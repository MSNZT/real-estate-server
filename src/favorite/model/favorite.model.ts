import { Ad } from "@/ad/model/ad.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ToggleFavoriteResponse {
  @Field(() => String)
  status: string;
}

@ObjectType()
export class FavoriteAd {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  adId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => Ad)
  ad: Ad;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
