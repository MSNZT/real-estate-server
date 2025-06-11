import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Resolver, Query } from "@nestjs/graphql";
import { User } from "@prisma/client";
import { GqlAuthGuard } from "@/auth/guards/graphql-auth-guard";
import { CurrentUser } from "@/user/decorators/current-user";
import { FavoriteService } from "./favorite.service";
import {
  FavoriteAd,
  SyncFavorites,
  ToggleFavoriteResponse,
} from "./model/favorite.model";
import { UnauthorizedExceptionFilter } from "@/ad/filters/unauthorizedExceptionFilter";
import { GraphQLExceptionFilter } from "@/lib/filters/graphql-exception-filter";

@UseFilters(UnauthorizedExceptionFilter)
@UseFilters(GraphQLExceptionFilter)
@Resolver("Favorite")
export class FavoriteResolver {
  constructor(private favoriteService: FavoriteService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ToggleFavoriteResponse, { name: "toggleFavoriteAd" })
  async toggleFavoriteAd(
    @Args("id", { type: () => ID }) adId: string,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return await this.favoriteService.toggleFavoriteAd(adId, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [FavoriteAd], { name: "getFavoriteAds" })
  async getFavoriteAds(@CurrentUser() user: Pick<User, "id">) {
    return this.favoriteService.getFavoriteAds(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SyncFavorites, { name: "syncFavorites" })
  async syncFavorites(
    @Args("ids", { type: () => [String] }) ids: string[],
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return await this.favoriteService.syncFavorites(ids, user.id);
  }
}
