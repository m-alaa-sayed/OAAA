import { CityDto } from './city-dto';
import { WilayatDto } from './wilayat-dto';
import { GovernorateDto } from './governorate-dto';
import { CountryDto } from './country-dto';

export interface UserRolesDto {
  id?: number;
  userId?: number;
  userUsername?: string;
  userEmail?: string;
  role?: any; // RoleDto with full role details including procedures, permissions, group, etc.
  isPermanent?: boolean;
  startDate?: string;
  endDate?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string;
}

export interface UserRoleDto {
  id?: number;
  roleId?: string | number;  // Can be either string or number depending on usage
  roleCode?: string;
  roleNameEn?: string;
  roleNameAr?: string;
  roleDescriptionEn?: string;
  roleDescriptionAr?: string;
  roleType?: string;
  typeCode?: string;
  categoryCode?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string;
  updatedOn?: string;
  rolesAuditEventList?: any[];
  isClientAccessible?: boolean;
}

export interface UserDetailsDto {
  id?: number;
  username?: string;
  email?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  mobileNo?: string;
  civilNo?: string;
  externalUser?: boolean;
  status?: string;
  isPasswordTemp?: boolean;
  roles?: UserRoleDto[];
  insideOman?: boolean | null;
  firstName?: string | null;
  secondName?: string | null;
  thirdName?: string | null;
  lastName?: string | null;
  firstNameAr?: string | null;
  secondNameAr?: string | null;
  thirdNameAr?: string | null;
  lastNameAr?: string | null;
  nameEnList?: string[];
  nameArList?: string[];
  city?: CityDto | null;
  cityId?: number | null;
  genderId?: number | null;
  nationalityId?: number | null;
  title?: string;
  birthDate?: string | null;
  jobTitle?: string | null;
  otherOrganization?: string | null;
  organization?: any;
  organizationId?: number | null;
  phoneNo?: string | null;
  address?: string | null;
  headOfBusiness?: boolean;
  passportNo?: string | null;
  passportBucketName?: string | null;
  passportFileName?: string | null;
  prefixId?: number | null;
  phoneNoKeyId?: number | null;
  mobileNoKeyId?: number | null;
  wilayatId?: number | null;
  wilayat?: WilayatDto | null;
  countryId?: number | null;
  country?: CountryDto | null;
  governorateId?: number | null;
  governorate?: GovernorateDto | null;
  usersAuditEvents?: any[];
  createdOn?: string;
  receiveSms?: boolean;
  receiveEmails?: boolean;
  createdBy?: number;
  userRoles?: UserRolesDto[];
  groupId?: number | null;
  group?: any;
}

export interface PageableDto {
  pageNumber?: number;
  pageSize?: number;
  sort?: any[];
  offset?: number;
  paged?: boolean;
  unpaged?: boolean;
}
