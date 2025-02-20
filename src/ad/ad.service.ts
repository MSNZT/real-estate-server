import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { LocationDto } from "./dto/createInput";
// import { QueryFilters } from "./types/queryFilters";
// import { VALID_FILTERS, validateQueryFilters } from "./config/filtersConfig";
// import { UpdateAdInput } from "./dto/updateAd.dto";
import { validateOrReject } from "class-validator";
import { propertyTypeMap } from "./map/propertyTypeMap";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { CreateAdInput, DealInput, LocationDto } from "./dto/createAdInput";
import { Ad } from "./model/ad.model";
import { UpdateAdInput } from "./dto/update.dto";
import {
  AdTypes,
  Deal,
  Prisma,
  PropertyDetails,
  PropertyTypes,
} from "@prisma/client";
import { AdFilterInput } from "./dto/queryFilters.dto";
import { DealFieldsDto } from "./dto/deal.dto";

@Injectable()
export class AdService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateAdInput, userId: string): Promise<Ad> {
    try {
      const { location, propertyDetails, deal, ...adData } = dto;
      console.log(adData);

      const propertyInstance = await this.validatePropertyDetailsFields(
        adData.propertyType,
        propertyDetails,
      );

      const dealInstance = await this.validateDeal(adData.adType, deal);

      return await this.prismaService.$transaction(async (prisma) => {
        const existingLocation = await this.getOrCreateLocation(location);

        return prisma.ad.create({
          data: {
            ...adData,
            location: { connect: { id: existingLocation } },
            owner: { connect: { id: userId } },
            propertyDetails: {
              create: {
                fields: propertyInstance as Prisma.InputJsonValue,
              },
            },
            deal: {
              create: dealInstance,
            },
          },
          include: {
            propertyDetails: true,
            location: true,
            owner: true,
            deal: true,
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
    const where = this.buildWhereClause(filter);
    const queryOptions = this.getQueryOptions(filter);

    try {
      const ads = await this.prismaService.ad.findMany({
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

      if (!ads.length) {
        return [];
      }

      return ads;
    } catch (err) {
      throw err;
    }
  }

  async getById(id: string) {
    try {
      return await this.prismaService.ad.findFirst({
        where: {
          id,
        },
        include: {
          owner: true,
          location: true,
          propertyDetails: true,
          booking: true,
          deal: true,
        },
      });
    } catch (e) {
      console.log(e, "getById");
      throw new BadRequestException(e);
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

      const { location, propertyDetails, deal, ...otherData } = dto;

      const updateData = {
        ...otherData,
        propertyDetails: this.preparePropertyDetailsUpdate(propertyDetails),
        deal: this.prepareDealUpdate(ad.deal, deal),
        updatedAt: new Date(),
      };

      if (location) {
        const existingLocationId = await this.getOrCreateLocation(location);
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

  async getOrCreateLocation(location: LocationDto) {
    const existingLocation = await this.prismaService.location.upsert({
      where: {
        latitude_longitude_city_street: location,
      },
      update: {},
      create: location,
    });
    return existingLocation.id;
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

  private async validatePropertyDetailsFields(
    propertyType: PropertyTypes,
    propertyDetails: Ad["propertyDetails"],
  ) {
    const propertyClass = propertyTypeMap.get(propertyType);
    if (!propertyClass) {
      throw new BadRequestException("Неверный тип свойства");
    }

    const propertyInstance = plainToInstance(
      propertyClass as unknown as ClassConstructor<object>,
      propertyDetails.fields,
      {
        excludeExtraneousValues: true,
      },
    );
    await validateOrReject(propertyInstance);
    return propertyInstance;
  }

  private async validateDeal(adType: AdTypes, deal: DealInput) {
    const { durationRent, price, fields } = deal;
    if (adType === "rent" && !durationRent) {
      throw new BadRequestException({ message: "Не указан durationRent" });
    }
    const dealFieldsInstance = plainToInstance(
      DealFieldsDto as unknown as ClassConstructor<object>,
      fields,
      {
        excludeExtraneousValues: true,
      },
    );
    await validateOrReject(dealFieldsInstance);
    const dealObject = {
      fields: dealFieldsInstance as Prisma.InputJsonValue,
      price,
      durationRent,
    };
    if (adType === "sell") {
      return {
        ...dealObject,
        durationRent: null,
      };
    }
    return dealObject;
  }
}
