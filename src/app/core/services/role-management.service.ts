import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResponse } from '../models/app-response';
import { AppConstants } from '../constants/app-constants';
import { 
  RoleOverviewDto, 
  RoleDto, 
  RoleRequestDto, 
  GroupDto, 
  ProcedureDto 
} from '../../pages/users-and-permissions-management/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleManagementService {

  constructor(private http: HttpClient) {}


  getRolesOverview(): Observable<RoleOverviewDto[]> {
    return this.http.get<AppResponse<RoleOverviewDto[]>>(AppConstants.API.ROLE_MANAGEMENT_ROLES_OVERVIEW)
      .pipe(map((response) => response.data));
  }


  getRoleById(id: number): Observable<RoleDto> {
    return this.http.get<AppResponse<RoleDto>>(`${AppConstants.API.ROLE_MANAGEMENT_ROLES}/${id}`)
      .pipe(map((response) => response.data));
  }


  createRole(roleRequest: RoleRequestDto, notes?: string): Observable<RoleDto> {
    const payload = {
      data: roleRequest,
      notes: notes || ''
    };
    return this.http.post<AppResponse<RoleDto>>(`${AppConstants.API.ROLE_MANAGEMENT_ROLES_ADD}`, payload)
      .pipe(map((response) => response.data));
  }


  updateRole(id: number, roleDto: RoleDto, notes?: string): Observable<RoleDto> {
    const payload = {
      data: roleDto,
      notes: notes || ''
    };
    return this.http.put<AppResponse<RoleDto>>(`${AppConstants.API.ROLE_MANAGEMENT_ROLES}/${id}`, payload)
      .pipe(map((response) => response.data));
  }


  deleteRole(id: number, notes?: string): Observable<void> {
    const payload = {
      data: null,
      notes: notes || ''
    };
    return this.http.request<AppResponse<void>>('delete', `${AppConstants.API.ROLE_MANAGEMENT_ROLES}/${id}`, { body: payload })
      .pipe(map((response) => response.data));
  }


  getGroups(): Observable<GroupDto[]> {
    return this.http.get<AppResponse<GroupDto[]>>(AppConstants.API.ROLE_MANAGEMENT_GROUPS)
      .pipe(map((response) => response.data));
  }

 
  getProcedures(): Observable<ProcedureDto[]> {
    return this.http.get<AppResponse<ProcedureDto[]>>(AppConstants.API.ROLE_MANAGEMENT_PROCEDURES)
      .pipe(map((response) => response.data));
  }

 
  getGroupsForAddingRole(userId: string): Observable<GroupDto[]> {
    return this.http.get<AppResponse<GroupDto[]>>(`${AppConstants.API.GROUP_MANAGEMENT_INITIATE_ADDING_ROLE}/${userId}`)
      .pipe(map((response) => response.data));
  }


  validateRoleName(changedNames: any): Observable<any> {
    return this.http.post<AppResponse<any>>(AppConstants.API.ROLE_MANAGEMENT_VALIDATE_ROLE_NAME, { nameAr: changedNames.nameAr, nameEn: changedNames.nameEn, roleId: changedNames.roleId })
      .pipe(map((response) => response));
  }
}
