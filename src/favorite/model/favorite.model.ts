import { Ad } from "@/ad/models/ad.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ToggleFavoriteResponse {
  @Field(() => ID)
  id: string;

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

@ObjectType()
export class SyncFavorites {
  @Field(() => Boolean)
  status: boolean;
}
