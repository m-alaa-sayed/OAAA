import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResponse } from '../models/app-response';
import { AppConstants } from '../constants/app-constants';
import { 
  UserOverviewResponse,
  AddUserPayload,
  SearchUserDto
} from '../../pages/users-and-permissions-management/models/users.model';
import { UserDetailsDto } from '../models/user-details.model';

@Injectable({ providedIn: 'root' })
export class UsersManagementService {

  private readonly userManagementApi = AppConstants.API.USER_MANAGEMENT;

  constructor(private http: HttpClient) {}

  /**
   * GET /user-management/?page={page}&size={size}
   */
  getUsersOverview(page: number = 0, size: number = 20): Observable<UserOverviewResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<AppResponse<UserOverviewResponse>>(this.userManagementApi.CLIENT_OVERVIEW, { params })
      .pipe(map((response) => response.data));
  }

  /**
   * GET /user-management/user/{userId}
   */
  getUserById(userId: string, userRoleFlag?: string): Observable<AppResponse<UserDetailsDto>> {
    return userRoleFlag?  this.http.get<AppResponse<UserDetailsDto>>(`${this.userManagementApi.BASE}/${userId}/${userRoleFlag}`) : this.http.get<AppResponse<UserDetailsDto>>(`${this.userManagementApi.BASE}/${userId}`) ;
  }

  /**
   * POST /user-management/user/validate/email
   */
  validateEmail(email: string, username?: string): Observable<any> {
    const payload = { email, username: username || email };
    return this.http.post<AppResponse<any>>(this.userManagementApi.VALIDATE_EMAIL, payload)
      .pipe(map((response) => response.data));
  }

  /**
   * POST /user-management/user/add
   */
  addUser(payload: AddUserPayload): Observable<any> {
    return this.http.post<AppResponse<any>>(this.userManagementApi.ADD_USER, payload)
      .pipe(map((response) => response.data));
  }

  /**
   * DELETE /user-management/user/{userId}
   */
  deleteUser(userId: string, notes?: string): Observable<any> {
    const payload = {
      data: null,
      notes: notes || ''
    };
    return this.http.request<AppResponse<any>>('delete', `${this.userManagementApi.BASE}/${userId}`, { body: payload })
      .pipe(map((response) => response.data));
  }

  /**
   * PUT /user-management/user/update/{userId}
   * Update user data including roles
   */
  updateUser(userId: string, userData: UserDetailsDto, notes?: string, userRoleFlag?: string): Observable<UserDetailsDto> {
    const payload = {
      data: userData,
      notes: notes || ''
    };
    return userRoleFlag ? this.http.put<AppResponse<UserDetailsDto>>(`${this.userManagementApi.UPDATE}/${userId}/${userRoleFlag}`, payload)
      .pipe(map((response) => response.data)) : this.http.put<AppResponse<UserDetailsDto>>(`${this.userManagementApi.UPDATE}/${userId}`, payload)
      .pipe(map((response) => response.data));
  }

  /**
   * PUT /user-management/update/{userId}
   * Update user profile information
   */
  updateUserProfile(userId: string, userData: UserDetailsDto, notes?: string): Observable<UserDetailsDto> {
    const payload = {
      data: userData,
      notes: notes || ''
    };
    return this.http.put<AppResponse<UserDetailsDto>>(`${this.userManagementApi.UPDATE}/${userId}`, payload)
      .pipe(map((response) => response.data));
  }

  /**
   * POST /user-management/change-password
   * Admin changes user password with notes
   */
  adminChangeUsersPassword(changePasswordData: any, notes?: string): Observable<any> {
    const payload = {
      data: changePasswordData,
      notes: notes || ''
    };
    return this.http.post<AppResponse<void>>(this.userManagementApi.CHANGE_PASSWORD, payload);
  }

  /**
   * GET /user-management/change-password/history/{userId}
   * Get password change history for a specific user
   */
  getPasswordChangeHistory(userId: string): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${this.userManagementApi.CHANGE_PASSWORD_HISTORY}/${userId}`)
      .pipe(map((response) => response.data));
  }

  /**
   * POST /user-management/search
   * Search for users with various criteria
   */
  searchUsers(searchCriteria: SearchUserDto): Observable<UserOverviewResponse> {
    return this.http.post<AppResponse<UserOverviewResponse>>(
      `${AppConstants.API.USER_MANAGEMENT.BASE}/search`, 
      searchCriteria
    ).pipe(map((response) => response.data));
  }

   /**
   * POST /user-management/search (without loading indicator)
   * Search for users with various criteria for server-side filtering
   */
  searchUsersWithoutLoading(searchCriteria: SearchUserDto): Observable<UserOverviewResponse> {
    const headers = { 'X-Skip-Loading': 'true' };
    return this.http.post<AppResponse<UserOverviewResponse>>(
      `${AppConstants.API.USER_MANAGEMENT.BASE}/search`, 
      searchCriteria,
      { headers }
    ).pipe(map((response) => response.data));
  }

  /**
   * GET /group-management/groups-basic-info
   */
  getGroupsBasicInfo(): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${AppConstants.API.GROUP_MANAGEMENT_BASIC_INFO_ADDING_USER}`)
      .pipe(map((response) => response.data));
  }
}
