import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppResponse } from 'src/app/core/models/app-response';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ExternalReviewersRegistrationComplete } from '../types/external-reviewers-registration-complete';

@Injectable({
    providedIn: 'root'
})
export class ExternalReviewerRequestService {


    constructor(private http: HttpClient) { }

    getRequestsByModule(module: string) {
        return this.http.get<AppResponse<any[]>>(
            `${AppConstants.API.EXTERNAL_REVIEWERS_REQUESTS_LIST}/${module}`
        );
    }


    getApprovedRequests(module: string) {
        return this.http.get<AppResponse<any[]>>(
            `${AppConstants.API.EXTERNAL_REVIEWERS_APPROVED_REQUESTS_LIST}/${module}`
        );
    }

    getStatusOptions() {
        return this.http.get<AppResponse<string[]>>(
            AppConstants.API.EXTERNAL_REVIEWERS_STATUS_OPTIONS
        );
    }

    complete(requestObject: ExternalReviewersRegistrationComplete) {
        return this.http.post<AppResponse<any>>(
            `${AppConstants.API.EXTERNAL_REVIEWERS_REGISTRATION_REQUEST_COMPLETE}`, requestObject
        );
    }



}