import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppResponse} from "../models/app-response";
import {AppConstants} from "../constants/app-constants";

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewersRegistrationRequestService {

  constructor(private http: HttpClient) {}


  getPreviousRequest(serviceCode: string) {
    return this.http.get<AppResponse<any[]>>(`${[AppConstants.PREVIOUS_REQUEST_DETAILS[serviceCode as keyof typeof AppConstants.PREVIOUS_REQUEST_DETAILS]]}/${serviceCode}/previous-requests`);
  }

  getRequestByRequestIdAndTaskId(requestId: any,taskId: any) {
    return this.http.get<AppResponse<any>>(`${AppConstants.API.EXTERNAL_REVIEWER_REGISTRATION_REQUEST}/${requestId}/${taskId}`);
  }

  getExternalReviewersByModuleNotAndUserId(userId: any,module: any) {
    return this.http.get<AppResponse<any>>(`${AppConstants.API.EXTERNAL_REVIEWER_REGISTRATION_REQUEST}/external-reviewers/${userId}/${module}`);
  }
}
