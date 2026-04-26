import { CityDto } from "./city-dto";
import { CountryDto } from "./country-dto";

export interface RequestUser {
    id?: number;
    insideOman?: boolean;
    mobileNo?: string;
    civilNo?: string;
    fullNameAr?: string;
    fullNameEn?: string;
    jobTitle?: string;
    email?: string;
    city?: CityDto;
    cityId?: number;

    genderId?: number;
    nationalityId?: number;
    title?: string;
    birthDate?: string; // Or Date if you convert it when consuming
    organization?: string;
    phoneNo?: string;
    streetAddress?: string;
    state?: string;
    zipCode?: string;
    headOfBusiness?: boolean;
    passportNo?: string;
    passportBucketName?: string;
    passportFileName?: string;
    prefixId?: number;
    phoneNoKeyId?: number;
    mobileNoKeyId?: number;

    firstName?: string;
    secondName?: string;
    thirdName?: string;
    lastName?: string;

    contactCity?: CityDto;
    contactCityId?: number;
    contactCountryId?: number;
    contactCountry?: CountryDto;
}
