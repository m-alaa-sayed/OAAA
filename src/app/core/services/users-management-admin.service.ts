import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResponse } from '../models/app-response';
import { AppConstants } from '../constants/app-constants';

@Injectable({ providedIn: 'root' })
export class UsersManagementAdminService {

  private readonly USER_MANAGEMENT_ADMIN = AppConstants.API.USER_MANAGEMENT_ADMIN;

  constructor(private http: HttpClient) { }


  getAllProcedures(): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${this.USER_MANAGEMENT_ADMIN.PROCEDURE}/`)
      .pipe(map((response) => response.data));
  }

  getProcedure(procedureId: number): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${this.USER_MANAGEMENT_ADMIN.PROCEDURE}/${procedureId}`)
      .pipe(map((response) => response.data));
  }

  addProcedure(body: any): Observable<any> {
    return this.http.post<AppResponse<any>>(`${this.USER_MANAGEMENT_ADMIN.PROCEDURE}/`, body)
      .pipe(map((response) => response.data));
  }

  updateProcedure(procedureId: any, body: any): Observable<any> {
    return this.http.put<AppResponse<any>>(`${this.USER_MANAGEMENT_ADMIN.PROCEDURE}/${procedureId}`, body)
      .pipe(map((response) => response.data));
  }

  deleteProcedure(procedureId: number): Observable<any> {
    const url = `${this.USER_MANAGEMENT_ADMIN.PROCEDURE}/${procedureId}`;
    return this.http.delete<AppResponse<any>>(url)
      .pipe(map((response) => response.data));
  }

  getAllPermissions(): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${this.USER_MANAGEMENT_ADMIN.PERMISSION}/`)
      .pipe(map((response) => response.data));
  }

  getPermission(permissionId: number): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(`${this.USER_MANAGEMENT_ADMIN.PERMISSION}/${permissionId}`)
      .pipe(map((response) => response.data));
  }

  addPermission(body: any): Observable<any> {
    return this.http.post<AppResponse<any>>(`${this.USER_MANAGEMENT_ADMIN.PERMISSION}/`, body)
      .pipe(map((response) => response.data));
  }

  updatePermission(permissionId: any, body: any): Observable<any> {
    return this.http.put<AppResponse<any>>(`${this.USER_MANAGEMENT_ADMIN.PERMISSION}/${permissionId}`, body)
      .pipe(map((response) => response.data));
  }

  deletePermission(permissionId: number): Observable<any> {
    const url = `${this.USER_MANAGEMENT_ADMIN.PERMISSION}/${permissionId}`;
    return this.http.delete<AppResponse<any>>(url)
      .pipe(map((response) => response.data));
  }
}