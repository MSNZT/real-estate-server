import { Body, Controller, Post, Res } from "@nestjs/common";
import { SaveLocationDto } from "./dto/save-location.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ComputeCityDto } from "./dto/compute-city.dto";
import { LocationService } from "./location.service";
import { CoordsDto } from "./dto/coords.dto";
import { QueryDto } from "./dto/query.dto";
import { LocationResponse } from "./response/location.response";

@Controller("location")
export class LocationController {
  constructor(
    private configService: ConfigService,
    private locationService: LocationService,
  ) {}

  @Post("apply-location")
  async saveLocationToCookie(
    @Body() dto: SaveLocationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log("buubbu", dto);
    res.cookie("location", JSON.stringify(dto), {
      secure: this.configService.getOrThrow("NODE_ENV") === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return {
      status: "success",
    };
  }

  @Post("compute-location")
  async computeLocationByIp(@Body() dto: ComputeCityDto) {
    return await this.locationService.computeLocationByIp(dto);
  }

  @Post("address-by-query")
  async getAddressByQuery(@Body() dto: QueryDto): Promise<LocationResponse[]> {
    return await this.locationService.getAddressByQuery(dto);
  }

  @Post("settlement-by-query")
  async getSettlementByQuery(
    @Body() dto: QueryDto,
  ): Promise<LocationResponse[]> {
    return await this.locationService.getSettlementByQuery(dto);
  }

  @Post("address-by-coords")
  async getAddressByCoords(
    @Body() dto: CoordsDto,
  ): Promise<LocationResponse[]> {
    return await this.locationService.getAddressByCoords(dto);
  }
}
