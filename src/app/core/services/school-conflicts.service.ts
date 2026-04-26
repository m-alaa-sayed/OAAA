import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { AppResponse } from '../models/app-response'

@Injectable({
    providedIn: 'root'
})
export class SchoolConflictsService {

    constructor(private http: HttpClient) { }

    getSchoolConflictsOverview(): Observable<any[]> {
        return this.http.get<AppResponse<any[]>>(`${AppConstants.API.baseURL}/oaaaqa/cseqa/school-conflicts-overview`).pipe(map(res => res.data));
    }

    getSchoolConflictsAudit(): Observable<any[]> {
        return this.http.get<AppResponse<any[]>>(`${AppConstants.API.baseURL}/oaaaqa/cseqa/school-conflicts-overview/audit`).pipe(map(res => res.data));
    }

    updateSchoolConflicts(body: any[]): Observable<any[]> {
        return this.http.put<AppResponse<any[]>>(`${AppConstants.API.baseURL}/oaaaqa/cseqa/school-conflicts-overview`, body).pipe(map(res => res.data));
    }

    searchSchoolConflicts(searchCriteria: any): Observable<any[]> {
        return this.http.post<AppResponse<any[]>>(`${AppConstants.API.baseURL}/oaaaqa/cseqa/school-conflicts-overview/search`, searchCriteria).pipe(map(res => res.data));
    }
}
