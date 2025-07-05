import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdService } from "./ad.service";
import { Ad } from "./models/ad.model";
import { CreateAdInput } from "./dto/create-ad.input";
import { UseFilters, UseGuards } from "@nestjs/common";
import { UnauthorizedExceptionFilter } from "./filters/unauthorizedExceptionFilter";
import { GqlAuthGuard } from "@/auth/guards/graphql-auth-guard";
import { CurrentUser } from "@/user/decorators/current-user";
import { User } from "@prisma/client";
import { UpdateAdInput } from "./dto/update-ad.input";
import { GraphQLExceptionFilter } from "@/lib/filters/graphql-exception-filter";
import { AdsResponse } from "./models/adsReponse";
import { AdFilterInput } from "./dto/ad-filter.input";
import { AdsByCategoriesInput } from "./dto/ads-by-categories.input";
import { AdsByCategories } from "./models/adsByCategoriesResponse";

@UseFilters(UnauthorizedExceptionFilter)
@UseFilters(GraphQLExceptionFilter)
@Resolver("Ad")
export class AdResolver {
  constructor(private adService: AdService) {}

  @Query(() => AdsResponse, { name: "getAllAds" })
  async getAllAds(
    @Args("filters", { nullable: true })
    filters?: AdFilterInput,
  ) {
    return await this.adService.getAll(filters);
  }

  @Query(() => [AdsByCategories], { name: "getAdsByCategories" })
  async getAdsByCategories(@Args("data") categories: AdsByCategoriesInput) {
    return await this.adService.getAdsByCategories(categories);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Ad, { name: "createAd" })
  async createAd(
    @Args("createAdInput")
    dto: CreateAdInput,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return await this.adService.create(dto, user.id);
  }

  @Query(() => Ad, { name: "getAdById", nullable: true })
  async getAdById(@Args("id", { type: () => ID }) id: string): Promise<Ad> {
    return await this.adService.getById(id);
  }

  @Query(() => [Ad], { name: "getAdsByIds" })
  async getAdsByIds(
    @Args("ids", { type: () => [String] }) ids: string[],
  ): Promise<Ad[]> {
    return await this.adService.getAdsByIds(ids);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Ad, { name: "updateAd" })
  async updateAd(
    @Args("id", { type: () => ID }) adId: string,
    @Args("updatedFields") updatedFields: UpdateAdInput,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return await this.adService.update(adId, updatedFields, user.id);
  }
}
