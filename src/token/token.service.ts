import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TokenService {
  logger = new Logger(TokenService.name);
  constructor(private prismaService: PrismaService) {}

  async getToken(jit: string) {
    try {
      const token = await this.prismaService.token.findFirst({
        where: { jit },
        select: {
          used: true,
          id: true,
        },
      });

      if (!token) throw new NotFoundException("Токен не найден");
      return token;
    } catch (error) {
      throw error;
    }
  }

  async createToken(token: string, userId: string) {
    try {
      await this.prismaService.token.create({
        data: {
          jit: token,
          used: false,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {}
  }

  async updateToken(tokenId: string) {
    try {
      await this.prismaService.token.update({
        where: { id: tokenId },
        data: {
          used: true,
        },
      });
    } catch (error) {
      this.logger.error("Произошла ошибка при обновлении token used", error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupTokens() {
    try {
      const deletionResult = await this.prismaService.token.deleteMany({
        where: {
          OR: [
            { used: true },
            {
              createdAt: {
                lt: new Date(Date.now() - 10 * 60 * 1000),
              },
            },
          ],
        },
      });
      this.logger.log(
        `Удалено ${deletionResult.count} токенов (использованные/просроченные)`,
      );
    } catch (error) {
      this.logger.error("Произошла ошибка при удалении токенов", error);
    }
  }
}
