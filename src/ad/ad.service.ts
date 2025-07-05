import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Deal, Prisma, PropertyDetails } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateAdInput } from "./dto/create-ad.input";
import { Ad } from "./models/ad.model";
import { UpdateAdInput } from "./dto/update-ad.input";
import { LocationService } from "@/location/location.service";
import { AdValidatorService } from "./services/ad-validator.service";
import { AdFilterInput } from "./dto/ad-filter.input";
import { filterContact } from "./utils/filter-contact";
import { mapPropertyDetailsFields } from "./map/property-details.map";
import { mapDealFields } from "./map/deal.map";
import { AdsByCategoriesInput } from "./dto/ads-by-categories.input";
import { AdsByCategories } from "./models/adsByCategoriesResponse";

@Injectable()
export class AdService {
  constructor(
    private prismaService: PrismaService,
    private locationService: LocationService,
    private validatorService: AdValidatorService,
  ) {}

  async create(dto: CreateAdInput, userId: string) {
    try {
      const { location, deal, contact, ...adData } = dto;

      const propertyDetailsInstance =
        await this.validatorService.validatePropertyDetailsFields(
          dto.propertyType,
          dto.propertyDetails,
        );
      const dealInstance = await this.validatorService.validateDeal(
        dto.adType,
        dto.deal,
      );

      return await this.prismaService.$transaction(async (prisma) => {
        const existingLocation =
          await this.locationService.getOrCreateLocation(location);

        return prisma.ad.create({
          data: {
            ...adData,
            location: { connect: { id: existingLocation } },
            owner: { connect: { id: userId } },
            propertyDetails: {
              create: {
                fields: propertyDetailsInstance,
              },
            },
            deal: {
              create: dealInstance,
            },
            contact: {
              create: contact,
            },
          },
          include: {
            propertyDetails: true,
            location: true,
            owner: true,
            deal: true,
            contact: true,
          },
        });
      });
    } catch (error) {
      if (Array.isArray(error)) {
        console.log(error);
        throw new BadRequestException({ error });
      }
      throw error;
    }
  }

  async getAll(filter: AdFilterInput) {
    console.log("all", filter);

    const where = this.buildWhereClause(filter);
    const queryOptions = this.getQueryOptions(filter);

    const r = await this.prismaService.ad.findMany({
      where: {
        OR: [{}],
      },
    });

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const count = await prisma.ad.count();
        const ads = await prisma.ad.findMany({
          ...queryOptions,
          where,
          include: {
            propertyDetails: true,
            owner: true,
            location: true,
            deal: true,
            booking: true,
          },
        });

        const totalPages = Math.ceil(count / filter.limit);
        const hasNextPage = Boolean(filter.page < totalPages);

        if (!ads.length) {
          return {
            ads: [],
            hasNextPage: false,
          };
        }

        return {
          ads,
          hasNextPage,
        };
      });
    } catch (err) {
      throw err;
    }
  }

  async getAdsByCategories({
    categories,
    limit,
  }: AdsByCategoriesInput): Promise<AdsByCategories[]> {
    try {
      const ads = await this.prismaService.ad.findMany({
        where: {
          OR: categories.map((category) => ({
            adType: category.adType,
            propertyType: category.propertyType,
            location: {
              city: {
                equals: category.city,
                mode: "insensitive",
              },
            },
          })),
        },
        include: {
          location: true,
          propertyDetails: true,
          deal: true,
          contact: true,
          owner: true,
        },
        take: limit,
        orderBy: {
          id: "desc",
        },
      });
      return categories.map((category) => ({
        adType: category.adType,
        propertyType: category.propertyType,
        ads: ads.filter(
          (ad) =>
            ad.adType === category.adType &&
            ad.propertyType === category.propertyType,
        ),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<Ad> {
    console.log("adId", id);

    try {
      const ad = await this.prismaService.ad.findUnique({
        where: {
          id,
        },
        include: {
          owner: true,
          location: true,
          propertyDetails: true,
          booking: true,
          deal: true,
          contact: true,
        },
      });
      console.log("ad", ad);
      if (!ad) {
        throw new NotFoundException("Объявление с таким id не найдено");
      }

      const mappedAd = {
        ...ad,
        deal: {
          ...ad.deal,
          fields: mapDealFields(ad.adType, ad.deal.fields),
        },
        propertyDetails: {
          fields: mapPropertyDetailsFields(
            ad.propertyType,
            ad.propertyDetails.fields,
          ),
        },
      };

      return filterContact(mappedAd as Ad);
    } catch (error) {
      throw error;
    }
  }

  async getAdsByIds(ids: string[]): Promise<Ad[]> {
    try {
      const ads = await this.prismaService.ad.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: {
          owner: true,
          location: true,
          propertyDetails: true,
          booking: true,
          deal: true,
          contact: true,
        },
      });
      if (!ads.length) {
        return [];
      }
      return ads.map((ad) => ({
        ...ad,
        deal:
          ad.deal && ad.deal.fields
            ? {
                ...ad.deal,
                fields: mapDealFields(ad.adType, ad.deal.fields),
              }
            : ad.deal,
        propertyDetails:
          ad.propertyDetails && ad.propertyDetails.fields
            ? {
                ...ad.propertyDetails,
                fields: mapPropertyDetailsFields(
                  ad.propertyType,
                  ad.propertyDetails.fields,
                ),
              }
            : ad.propertyDetails,
      })) as Ad[];
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Объявление с таким id не найдено");
      }
      throw new InternalServerErrorException("Ошибка сервера");
    }
  }

  async update(adId: string, dto: UpdateAdInput, userId: string) {
    try {
      const ad = await this.prismaService.ad.findFirst({
        where: { id: adId },
        include: {
          location: true,
          owner: true,
          propertyDetails: true,
          deal: true,
        },
      });

      if (!ad || ad.ownerId !== userId) {
        return new ForbiddenException(
          "Нет доступа для обновления или объявление не найдено",
        );
      }

      const { location, deal, propertyDetails, ...otherData } = dto;

      const updateData = {
        ...otherData,
        propertyDetails: this.preparePropertyDetailsUpdate(propertyDetails),
        deal: this.prepareDealUpdate(ad.deal, deal),
        updatedAt: new Date(),
      };

      if (location) {
        const existingLocationId =
          await this.locationService.getOrCreateLocation(location);
        updateData["location"] = { connect: { id: existingLocationId } };
      }

      const updatedAd = await this.prismaService.ad.update({
        where: { id: adId },
        data: updateData,
        include: {
          location: true,
          owner: true,
          deal: true,
          propertyDetails: true,
        },
      });

      if (!updatedAd) {
        return new BadRequestException("Не удалось обновить объявление");
      }

      return updatedAd;
    } catch (e) {
      throw e;
    }
  }

  private preparePropertyDetailsUpdate(
    propertyDetails?: Partial<PropertyDetails>,
  ) {
    if (!propertyDetails?.fields) {
      return undefined;
    }
    return { update: { ...propertyDetails } };
  }

  private prepareDealUpdate(existingDeal: Deal, newDeal?: Partial<Deal>) {
    if (!newDeal) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, adId, createdAt, updatedAt, ...otherDeal } = existingDeal;
    return { update: { ...otherDeal, ...newDeal } };
  }

  private getQueryOptions({
    page = 1,
    limit = 10,
  }: AdFilterInput): Prisma.AdFindManyArgs {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  private buildWhereClause(filter: AdFilterInput): Prisma.AdWhereInput {
    const conditions: Prisma.AdWhereInput[] = [];

    if (filter.ids) {
      conditions.push({
        id: { in: filter.ids },
      });
    }

    if (filter.location) {
      const { fields, city } = filter.location;

      // if (fields) {
      //   const { latitudeRange, longitudeRange } = fields;

      //   if (
      //     latitudeRange[0] > latitudeRange[1] ||
      //     longitudeRange[0] > longitudeRange[1]
      //   ) {
      //     throw new BadRequestException("Invalid coordinates range");
      //   }

      //   conditions.push({
      //     location: {
      //       AND: [
      //         {
      //           latitude: {
      //             gte: latitudeRange[0],
      //             lte: latitudeRange[1],
      //           },
      //           longitude: {
      //             gte: longitudeRange[0],
      //             lte: longitudeRange[1],
      //           },
      //         },
      //       ],
      //     },
      //   });
      // }

      if (city) {
        console.log("city", city);
        conditions.push({
          location: {
            city: { equals: city, mode: "insensitive" },
          },
        });
      }
    }

    // if (latitudeRange && longitudeRange) {
    //   conditions.push({
    //     location: {
    //       AND: [
    //         {
    //           latitude: {
    //             gte: latitudeRange[0],
    //             lte: latitudeRange[1],
    //           },
    //           longitude: {
    //             gte: longitudeRange[0],
    //             lte: longitudeRange[1],
    //           },
    //         },
    //       ],
    //     },
    //   });
    // }

    if (filter.deal) {
      conditions.push({
        deal: {
          price: {
            gte: filter.deal.price.from || undefined,
            lte: filter.deal.price.to || undefined,
          },
        },
      });
    }

    if (filter.adType) {
      conditions.push({ adType: filter.adType });
    }

    if (filter.propertyType) {
      conditions.push({ propertyType: filter.propertyType });
    }

    if (filter.propertyDetails?.fields) {
      const jsonConditions = Object.entries(filter.propertyDetails.fields).map(
        ([key, value]) => ({
          propertyDetails: {
            fields: {
              path: [key],
              equals: value,
            },
          },
        }),
      );

      conditions.push({ AND: jsonConditions });
    }
    return conditions.length ? { AND: conditions } : {};
  }
}
