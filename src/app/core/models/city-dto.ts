import { CountryDto } from "./country-dto";

export interface CityDto {
    id?: number;
    cityNameAr?: string;
    cityNameEn?: string;
    countryId?: number;
    country?:CountryDto;
}