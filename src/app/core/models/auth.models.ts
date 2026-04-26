import { Permission } from "../enum/permission";
import { CityDto } from "./city-dto";
import { CountryDto } from "./country-dto";
import { GovernorateDto } from "./governorate-dto";
import { WilayatDto } from "./wilayat-dto";

export class User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  mobileNo?: string;
  civilNo?: string;
  externalUser?: boolean;
  status?: string;
  isPasswordTemp?: boolean;
  refreshToken?: string;
  roles?: any[];
  token?: string;
  permissions?: Permission[];

  insideOman?: boolean;
  countryId?: number;
  cityId?: number;
  // SystemLookup gender;
  genderId?: number;
  //Country nationality;
  nationalityId?: number;
  title?: string;
  birthDate?: Date
  jobTitle?: string;
  phoneNo?: string;

  streetAddress?: string;
  state?: string;
  zipCode?: string;
  headOfBusiness?: boolean;
   operationalStatus?:string;

  passportNo?: string;
  passportBucketName?: string;
  passportFileName?: string;
  //SystemLookup prefix;
  prefixId?: number;
  // Country phoneNoKey;
  phoneNoKeyId?: number;
  //Country mobileNoKey;
  mobileNoKeyId?: number;
  city?: CityDto;
  country?: CountryDto;
  governorate?: GovernorateDto;
  governorateId?: number;

  wilayat?: WilayatDto;
  wilayatId?: number;

  firstName?: string;
  secondName?: string;
  thirdName?: string;
  lastName?: string;

  firstNameAr?: string;
  secondNameAr?: string;
  thirdNameAr?: string;
  lastNameAr?: string;

  otherOrganization?: string;
  organizationId?: number;

  contactCity?: CityDto;
  contactCityId?: number;
  contactCountryId?: number;
  contactCountry?: CountryDto;

  centerId?: number;

}
