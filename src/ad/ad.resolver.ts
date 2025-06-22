import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdService } from "./services/ad.service";
import { Ad } from "./model/ad.model";
import { CreateAdInput } from "./dto/createAdInput";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AdFilterInput } from "./dto/adFilterInput";
import { UnauthorizedExceptionFilter } from "./filters/unauthorizedExceptionFilter";
import { GqlAuthGuard } from "@/auth/guards/graphql-auth-guard";
import { CurrentUser } from "@/user/decorators/current-user";
import { User } from "@prisma/client";
import { UpdateAdInput } from "./dto/update.dto";
import { GraphQLExceptionFilter } from "@/lib/filters/graphql-exception-filter";
import { AdsResponse } from "./model/adsReponse";

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
