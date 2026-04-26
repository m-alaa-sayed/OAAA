export interface RegistrationCompletionRequestDto {

    id?: number;
    username?: string;
    password?: string;
    confirmPassword?: string;

    email: string;
    mobileNo?: string;
    civilNo?: string;

    fullNameAr?: string;
    fullNameEn?: string;
    insideOman?: boolean;

    cityId?: number;
    genderId?: number;
    nationalityId?: number;

    title?: string;
    birthDate?: Date;
    jobTitle?: string;
    phoneNo?: string;
    streetAddress?: string;
    state?: string;
    zipCode?: string;
    headOfBusiness?: boolean;
    operationalStatus?: 'EMPLOYED' | 'RETIRED' | 'RETIRED_PART_TIME';
    passportNo?: string;
    passportBucketName?: string;
    passportFileName?: string;

    prefixId?: number;
    phoneNoKeyId?: number;
    mobileNoKeyId?: number;

    countryId?: number;

    governorateId?: number;
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

    contactCityId?: number;
    contactCountryId?: number;
}