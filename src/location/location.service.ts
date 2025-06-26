import { PrismaService } from "@/prisma/prisma.service";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { GetOrCreateLocationDto } from "./dto/getOrCreateLocation.dto";
import { ComputeCityDto } from "./dto/compute-city.dto";
import { ConfigService } from "@nestjs/config";
import { ComputeCityResponse } from "./types/compute-city.types";

@Injectable()
export class LocationService {
  private dadataUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs";
  private logger = new Logger();
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async getOrCreateLocation(location: GetOrCreateLocationDto) {
    try {
      const existingLocation = await this.prismaService.location.upsert({
        where: {
          latitude_longitude_city_address: location,
        },
        update: {},
        create: location,
      });
      return existingLocation.id;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async computeCityByIp(dto: ComputeCityDto): Promise<string | boolean> {
    try {
      const response = await fetch(`${this.dadataUrl}/iplocate/address `, {
        body: JSON.stringify({ ip: dto.ip }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.configService.get<string>("DADATA_API_KEY")}`,
        },
      });
      const data = (await response.json()) as ComputeCityResponse;
      console.log(data);
      if (data.location === null) {
        return false;
      }
      if (data.location.data.country !== "Россия") {
        throw new BadRequestException("Неудалось определить город");
      }
      return data.location.data.city || data.location.data.settlement || null;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
