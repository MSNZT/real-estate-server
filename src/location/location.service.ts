import { PrismaService } from "@/prisma/prisma.service";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { GetOrCreateLocationDto } from "./dto/getOrCreateLocation.dto";
import { ComputeCityDto } from "./dto/compute-city.dto";
import { ConfigService } from "@nestjs/config";
import { ComputeCityResponse } from "./types/compute-city.types";
import { ComputeLocationResponse } from "./response/compute-location.response";
import { QueryDto } from "./dto/query.dto";
import { CoordsDto } from "./dto/coords.dto";
import {
  AddressSuggestion,
  AddressSuggestionsResponse,
} from "./types/dadata.types";
import { LocationResponse } from "./response/location.response";

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

  async computeLocationByIp(
    dto: ComputeCityDto,
  ): Promise<ComputeLocationResponse | null> {
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
      if (data.location === null) {
        return null;
      }
      if (data.location.data.country !== "Россия") {
        throw new BadRequestException("Неудалось определить город");
      }
      return {
        city: data.location.data.city,
        latitude: data.location.data.geo_lat,
        longitude: data.location.data.geo_lon,
      };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getAddressByQuery(dto: QueryDto) {
    try {
      const response = await fetch(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          body: JSON.stringify({
            query: dto.query,
            locations: [{ country: "Россия" }],
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.configService.get<string>("DADATA_API_KEY")}`,
          },
        },
      );
      const data = (await response.json()) as AddressSuggestionsResponse;
      return this.normalizeAddressSuggestions(data);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getSettlementByQuery(dto: QueryDto) {
    try {
      const response = await fetch(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          body: JSON.stringify({
            query: dto.query,
            locations: [{ country: "Россия" }],
            from_bound: { value: "city" },
            to_bound: { value: "settlement" },
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.configService.get<string>("DADATA_API_KEY")}`,
          },
        },
      );
      const data = (await response.json()) as AddressSuggestionsResponse;
      return this.normalizeAddressSuggestions(data);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getAddressByCoords(dto: CoordsDto) {
    try {
      console.log("ENV_API", this.configService.get<string>("DADATA_API_KEY"));
      const response = await fetch(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address`,
        {
          body: JSON.stringify({
            lat: dto.lat,
            lon: dto.lon,
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.configService.get<string>("DADATA_API_KEY")}`,
          },
        },
      );
      const data = (await response.json()) as AddressSuggestionsResponse;
      return this.normalizeAddressSuggestion(data.suggestions[0]);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private normalizeAddressSuggestions(
    location: AddressSuggestionsResponse,
  ): LocationResponse[] {
    return location.suggestions.map(this.normalizeAddressSuggestion);
  }

  private normalizeAddressSuggestion(
    location: AddressSuggestion,
  ): LocationResponse {
    console.log("object", location);
    return {
      value: location.value,
      country: location.data.country,
      city: location.data.city,
      settlement: location.data.settlement_with_type,
      geo_lat: location.data.geo_lat,
      geo_lon: location.data.geo_lon,
      street: location.data.street_with_type,
      house: location.data.house,
    };
  }
}
