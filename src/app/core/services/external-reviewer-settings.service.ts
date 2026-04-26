import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AppResponse } from '../models/app-response';
import { AppConstants } from '../constants/app-constants';
import { ExternalReviewerSettingDto } from "../../pages/external-reviewers/types/external-reviewer-setting.dto";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerSettingsService {
  constructor(private http: HttpClient) { }

  getSettingsByModule(module: string): Observable<ExternalReviewerSettingDto> {
    return this.http.get<AppResponse<ExternalReviewerSettingDto>>(
      `${AppConstants.API.EXTERNAL_REVIEWER_SETTINGS}${module}`,
      httpOptions
    ).pipe(map(res => res.data));
  }

  updateSettings(module: string, dto: ExternalReviewerSettingDto): Observable<void> {
    return this.http.post<void>(
      `${AppConstants.API.EXTERNAL_REVIEWER_SETTINGS}${module}`,
      dto,
      httpOptions
    );
  }

  getAuditLogs(module: string): Observable<any[]> {
    return this.http.get<AppResponse<any[]>>(
      `${AppConstants.API.EXTERNAL_REVIEWER_SETTINGS}audit/${module}`,
      httpOptions
    ).pipe(map(res => res.data));
  }
  findByVersionAndModule(module: string, version: number): Observable<ExternalReviewerSettingDto> {
    return this.http.get<AppResponse<ExternalReviewerSettingDto>>(
      `${AppConstants.API.EXTERNAL_REVIEWER_SETTINGS}${module}/${version}`,
      httpOptions
    ).pipe(map(res => res.data));
  }
}
