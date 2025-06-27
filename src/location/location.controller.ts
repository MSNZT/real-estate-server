import { Body, Controller, Post, Res } from "@nestjs/common";
import { SaveCityDto } from "./dto/save-city.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ComputeCityDto } from "./dto/compute-city.dto";
import { LocationService } from "./location.service";

@Controller("location")
export class LocationController {
  constructor(
    private configService: ConfigService,
    private locationService: LocationService,
  ) {}

  @Post("apply-city")
  async saveCityToCookie(
    @Body() dto: SaveCityDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie("city", dto.city, {
      secure: this.configService.getOrThrow("NODE_ENV") === "production",
      httpOnly: true,
      sameSite: "lax",
    });

    return {
      status: "success",
    };
  }

  @Post("compute-city")
  async computeCityByIp(@Body() dto: ComputeCityDto) {
    return await this.locationService.computeCityByIp(dto);
  }
}
