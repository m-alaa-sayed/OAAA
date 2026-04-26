import { CityDto } from "src/app/core/models/city-dto";
import { CountryDto } from "src/app/core/models/country-dto";
import { GovernorateDto } from "src/app/core/models/governorate-dto";
import { UserRolesDto } from "src/app/core/models/user-details.model";
import { WilayatDto } from "src/app/core/models/wilayat-dto";

export interface UserOverviewDto {
    id: number | string,
    email: string,
    username: string,
    mobileNo: number,
    civilNo: string,
    status: string,
    fullNameAr: string,
    fullNameEn: string,
    insideOman: any,
    nationalityNameAr: string,
    nationalityNameEn: string,
    organizationNameAr: string,
    organizationNameEn: string,
    groupNameAr: string,
    groupNameEn: string,
    passportNo: string,
    countryNameAr: string,
    countryNameEn: string,
    createdOn: string,
    externalUser: boolean
}


export interface UserOverviewResponse {
    data?: UserOverviewDto[],
    content?: UserOverviewDto[],
    pageable: any,
    last: boolean,
    first: boolean,
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    sort: any,
    numberOfElements: number,
    empty: boolean
}

/**
 * Payload for adding a new user via API.
 * Note: This should be wrapped in { data: AddUserPayload, notes: string } when sent to backend.
 * API Endpoint: POST /user-management/user/add
 */
export interface AddUserPayload {
    email: string;
    username?: string;
    firstNameEn: string;
    secondNameEn?: string;
    thirdNameEn?: string;
    lastNameEn: string;
    firstNameAr: string;
    secondNameAr: string;
    thirdNameAr: string;
    lastNameAr: string;
    mobileNo: string;
    phoneNo?: string;
    civilNo: string;
    insideOman: boolean;
    cityId: number;
    genderId: number;
    nationalityId: number;
    countryId: number;
    birthDate: string;
    jobTitle: string;
    organizationId: number;
    headOfBusiness: boolean;
    passportNo?: string;
    passportBucketName?: string;
    passportFileName?: string;
    title?: string;
    prefixId: number;
    phoneNoKeyId: number;
    mobileNoKeyId: number;
    smsNotifications?: boolean;
    emailNotifications?: boolean;
    externalUser?: boolean;
    wilayatId?: number;
    governorateId?: number;
    groupId?: number;
    isDeleted?: boolean;
}

/**
 * User form payload for add/edit user components.
 * This interface represents the structure used in reactive forms
 * for user management operations.
 */
export interface UserFormPayload {
    id?: number;
    email?: string;
    username?: string;
    fullNameAr?: string;
    fullNameEn?: string;
    mobileNo?: string;
    civilNo?: string;
    externalUser?: boolean;
    status?: string;
    insideOman?: boolean | null;
    residentialCountryId?: number | null;
    cityId?: number | null;
    genderId?: number | null;
    nationalityId?: number | null;
    title?: string | null;
    birthDate?: Date | string | null;
    jobTitle?: string | null;
    phoneNo?: string | null;
    streetAddress?: string | null;
    state?: string;
    zipCode?: string;
    headOfBusiness?: boolean;
    passportNo?: string | null;
    passportBucketName?: string | null;
    passportFileName?: string | null;
    prefixId?: number | null;
    phoneNoKeyId?: number | null;
    mobileNoKeyId?: number | null;
    governorateId?: number | null;
    wilayatId?: number | null;
    userRoles?: UserRolesDto[];

    // English name fields
    firstNameEn?: string;
    secondNameEn?: string;
    thirdNameEn?: string;
    lastNameEn?: string;

    // Arabic name fields
    firstNameAr?: string;
    secondNameAr?: string;
    thirdNameAr?: string;
    lastNameAr?: string;

    // Organization fields
    organizationId?: number | null;
    centerId?: number;
    operationalStatus?: string | null;

    // Nested location objects (read-only from API)
    city?: CityDto | null;
    country?: CountryDto | null;
    governorate?: GovernorateDto | null;
    wilayat?: WilayatDto | null;
}

export interface SearchUserDto {
    username?: string;
    email?: string;
    mobileNo?: string;
    civilNo?: string;
    fullNameAr?: string;
    fullNameEn?: string;
    status?: string;
    insideOman?: boolean;
    externalUser?: boolean;
    organizationLookupValueAr?: string;
    organizationLookupValueEn?: string;
    groupNameAr?: string;
    groupNameEn?: string;
    countryNameAr?: string;
    countryNameEn?: string;
    createdOn?: string;
}