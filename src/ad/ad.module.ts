import { Module } from "@nestjs/common";
import { AdService } from "./ad.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AdResolver } from "./ad.resolver";
import { LocationService } from "@/location/location.service";
import { AdValidatorService } from "./services/ad-validator.service";

@Module({
  providers: [
    AdService,
    PrismaService,
    AdResolver,
    LocationService,
    AdValidatorService,
  ],
})
export class AdModule {}
