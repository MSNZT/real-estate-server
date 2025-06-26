export type ComputeCityResponse = {
  location: ComputeCityLocation;
};

type ComputeCityLocation = {
  value: string;
  data: ComputeCityLocationData;
};

type ComputeCityLocationData = {
  country: string | null;
  city: string | null;
  city_type_full: null;
  settlement_type_full: null;
  settlement: null;
  geo_lat: string;
  geo_lon: string;
};
