import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { validateOrReject } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Deal, Prisma, PropertyDetails, PropertyTypes } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateAdInput, DealInput, LocationDto } from "../dto/createAdInput";
import { Ad } from "../model/ad.model";
import { AdFilterInput } from "../dto/adFilterInput";
import { UpdateAdInput } from "../dto/update.dto";
import { propertyTypeMap } from "../map/propertyTypeMap";
import { DealFieldsDto } from "../dto/deal.dto";

@Injectable()
export class AdService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateAdInput, userId: string): Promise<Ad> {
    try {
      const { location, propertyDetails, deal, contact, ...adData } = dto;
      console.log(adData);

      const propertyInstance = await this.validatePropertyDetailsFields(
        adData.propertyType,
        propertyDetails,
      );

      const dealInstance = await this.validateDeal(deal);

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
    const where = this.buildWhereClause(filter);
    const queryOptions = this.getQueryOptions(filter);

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

  filterContact(ad: Ad): Ad {
    const { communication, name, phone } = ad.contact;
    const type = ad.contact.communication;
    switch (type) {
      case "calls-only": {
        return {
          ...ad,
          contact: {
            phone,
            name,
            communication,
          },
        };
      }
      case "calls-and-message": {
        return {
          ...ad,
          contact: {
            phone,
            name,
            communication,
          },
        };
      }
      case "message-only": {
        return {
          ...ad,
          contact: {
            name,
            communication,
          },
        };
      }
    }
  }

  async getById(id: string): Promise<Ad> {
    console.log(id);

    try {
      const ad = await this.prismaService.ad.update({
        where: {
          id,
        },
        data: {
          views: {
            increment: 1,
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
      return this.filterContact(ad);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Объявление с таким id не найдено");
      }
      throw new InternalServerErrorException("Ошибка сервера"); // Другие ошибки
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
        latitude_longitude_city_address: location,
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

    if (filter.ids) {
      conditions.push({
        id: { in: filter.ids },
      });
    }

    if (filter.location) {
      const { fields } = filter.location;

      if (fields) {
        const { latitudeRange, longitudeRange } = fields;

        if (
          latitudeRange[0] > latitudeRange[1] ||
          longitudeRange[0] > longitudeRange[1]
        ) {
          throw new BadRequestException("Invalid coordinates range");
        }

        conditions.push({
          location: {
            AND: [
              {
                latitude: {
                  gte: latitudeRange[0],
                  lte: latitudeRange[1],
                },
                longitude: {
                  gte: longitudeRange[0],
                  lte: longitudeRange[1],
                },
              },
            ],
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

  private async validateDeal(deal: DealInput) {
    const { price, fields } = deal;
    const dealFieldsInstance = plainToInstance(
      DealFieldsDto as unknown as ClassConstructor<object>,
      fields,
      {
        excludeExtraneousValues: true,
      },
    );
    await validateOrReject(dealFieldsInstance);
    return {
      fields: dealFieldsInstance as Prisma.InputJsonValue,
      price,
    };
  }
}
