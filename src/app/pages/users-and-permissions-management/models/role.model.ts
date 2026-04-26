// ============ DTOs matching Swagger API ============

export interface RoleOverviewDto {
  id?: number;
  roleCode?: string;
  roleNameEn?: string;
  roleNameAr?: string;
  roleDescriptionEn?: string;
  roleDescriptionAr?: string;
  groupCode?: string;
  groupNameAr?: string;
  groupNameEn?: string;
  isActive?: boolean;
  typeCode?: string;
  typeCodeNameAr?: string;
  typeCodeNameEn?: string;
  createdOn?: string;
}

export interface PermissionDto {
  id?: number;
  code?: string;
  permissionCode?: string;
  permissionNameEn?: string;
  permissionNameAr?: string;
  permissionDescriptionEn?: string;
  permissionDescriptionAr?: string;
  isClientAccessible?: boolean;
  enabled?: boolean;
}

export interface RoleTypeDto {
  code?: string;
  nameAr?: string;
  nameEn?: string;
}

export interface RoleCategoryDto {
  code?: string;
  nameAr?: string;
  nameEn?: string;
  displayOrder?: number;
}

export interface ProcedureDto {
  id?: number;
  code?: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive?: boolean;
  createdOn?: string;
  permissions?: PermissionDto[];
  isClientAccessible?: boolean;
  enabled?: boolean;
}

export interface GroupDto {
  id?: number;
  code?: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  createdBy?: number;
  createdOn?: string;
  updatedBy?: number;
  updatedOn?: string;
  procedures?: ProcedureDto[];
  roles?: RoleDto[]; // Roles belonging to this group
  isClientAccessible?: boolean;
}

export interface RolesAuditEventDto {
  id?: number;
  operationType?: string;
  createdOn?: string;
  notes?: string;
  userFullNameAr?: string;
  userFullNameEn?: string;
  roleId?: number;
}

export interface RoleDto {
  id?: number;
  roleCode?: string;
  roleNameEn?: string;
  roleNameAr?: string;
  roleDescriptionEn?: string;
  roleDescriptionAr?: string;
  permissions?: PermissionDto[];
  isActive?: boolean;
  createdOn?: string;
  updatedOn?: string;
  procedures?: ProcedureDto[];
  group?: GroupDto;
  typeCode?: string;
  categoryCode?: string;
  roleType?: RoleTypeDto;
  roleCategory?: RoleCategoryDto;
  rolesAuditEventList?: RolesAuditEventDto[];
  isClientAccessible?: boolean;
}

export interface RoleRequestDto {
  roleCode?: string;
  roleNameEn?: string;
  roleNameAr?: string;
  roleDescriptionEn?: string;
  roleDescriptionAr?: string;
  procedurePermissions?: { [procedureId: string]: number[] };
  groupId?: number;
  groupCode?: number;
  isActive?: boolean;
  typeCode?: string;
  categoryCode?: string;
}

// ============ UI Helper Interfaces for Procedures Display ============

export interface ProcedureActionUI {
  id?: number;
  permissionCode?: string;
  label: string;
  checked: boolean;
}

export interface ProcedureUI {
  id?: number;
  code?: string;
  label: string;
  enabled: boolean;
  permissions: ProcedureActionUI[];
}
