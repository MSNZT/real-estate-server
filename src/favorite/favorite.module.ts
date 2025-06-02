import { Module } from "@nestjs/common";
import { FavoriteResolver } from "./favorite.resolver";
import { FavoriteService } from "./favorite.service";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  providers: [FavoriteResolver, FavoriteService, PrismaService],
})
export class FavoriteModule {}
