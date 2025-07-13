import { Body, Controller, Post, Res } from "@nestjs/common";
import { ComputeCityDto } from "./dto/compute-city.dto";
import { LocationService } from "./location.service";
import { CoordsDto } from "./dto/coords.dto";
import { QueryDto } from "./dto/query.dto";
import { LocationResponse } from "./response/location.response";

@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) {}

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
  async getAddressByCoords(@Body() dto: CoordsDto): Promise<LocationResponse> {
    return await this.locationService.getAddressByCoords(dto);
  }
}
