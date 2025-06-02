import { Module } from "@nestjs/common";
import { AdService } from "./services/ad.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AdResolver } from "./ad.resolver";
import { PriceScalar } from "./dto/price";

@Module({
  providers: [AdService, PrismaService, AdResolver, PriceScalar],
})
export class AdModule {}
