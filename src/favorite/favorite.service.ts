import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class FavoriteService {
  logger = new Logger(FavoriteService.name);
  constructor(private prismaService: PrismaService) {}

  async getFavoriteAds(userId: string) {
    try {
      const favorites = await this.prismaService.favoriteAd.findMany({
        where: {
          userId,
        },
        include: {
          ad: {
            include: {
              deal: true,
              location: true,
            },
          },
        },
      });

      if (favorites.length) {
        return favorites;
      }
      return [];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async toggleFavoriteAd(adId: string, userId: string) {
    try {
      const existingFavorite = await this.prismaService.favoriteAd.findUnique({
        where: {
          adId_userId: {
            adId,
            userId,
          },
        },
      });

      if (existingFavorite) {
        return await this.deleteFromFavorite(adId, existingFavorite.id);
      } else {
        return await this.addToFavorite(adId, userId);
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async syncFavorites(ids: string[], userId: string) {
    try {
      const existingAds = await this.prismaService.ad.findMany({
        where: {
          id: { in: ids },
        },
        select: {
          id: true,
        },
      });

      const existingIds = existingAds.map((ad) => ad.id);

      for (const adId of existingIds) {
        await this.prismaService.favoriteAd.upsert({
          where: {
            adId_userId: { adId, userId },
          },
          update: {},
          create: { adId, userId },
        });
      }
      return {
        status: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async addToFavorite(adId: string, userId: string) {
    try {
      const adExists = await this.prismaService.ad.findUnique({
        where: {
          id: adId,
        },
      });

      if (!adExists) {
        throw new NotFoundException("Объявление не найдено");
      }

      await this.prismaService.favoriteAd.create({
        data: {
          adId,
          userId,
        },
      });
      return {
        id: adId,
        status: "added",
      };
    } catch (error) {
      this.logger.error("Ошибка при добавлении в избранные", error);
      throw error;
    }
  }

  private async deleteFromFavorite(adId: string, favoriteId: string) {
    try {
      await this.prismaService.favoriteAd.delete({
        where: {
          id: favoriteId,
        },
      });

      return {
        id: adId,
        status: "deleted",
      };
    } catch (error) {
      this.logger.error("Ошибка при удалении из избранных", error);
      throw error;
    }
  }
}
