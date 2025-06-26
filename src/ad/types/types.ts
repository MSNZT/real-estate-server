import {
  RentLongDealFieldsModel,
  RentShortDealFieldsModel,
  SellDealFieldsModel,
} from "../models/deal/deal.dto";
import { ApartmentFieldsModel } from "../models/real-property/apartment.model";
import { HouseFieldsModel } from "../models/real-property/house.model";

export type RealPropertyDetailsType = ApartmentFieldsModel | HouseFieldsModel;
export type DealFieldsType =
  | SellDealFieldsModel
  | RentShortDealFieldsModel
  | RentLongDealFieldsModel;
