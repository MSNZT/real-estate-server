import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";

@Module({
  controllers: [LocationController],
  exports: [LocationService],
  providers: [LocationService, PrismaService],
})
export class LocationModule {}
