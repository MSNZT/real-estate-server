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

      console.log(favorites);

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
        return await this.deleteFromFavorite(existingFavorite.id);
      } else {
        return await this.addToFavorite(adId, userId);
      }
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
        status: "added",
      };
    } catch (error) {
      this.logger.error("Ошибка при добавлении в избранные", error);
      throw error;
    }
  }

  private async deleteFromFavorite(favoriteId: string) {
    try {
      await this.prismaService.favoriteAd.delete({
        where: {
          id: favoriteId,
        },
      });

      return {
        status: "removed",
      };
    } catch (error) {
      this.logger.error("Ошибка при удалении из избранных", error);
      throw error;
    }
  }
}
