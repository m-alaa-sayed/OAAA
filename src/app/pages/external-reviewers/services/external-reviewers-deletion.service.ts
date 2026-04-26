import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { AppResponse } from 'src/app/core/models/app-response';
import { ExternalReviewerDeletionRequest } from '../types/external-reviewer-deletion-request';
import { ExternalReviewerDeletionCreate } from '../types/external-reviewer-deletion-create';
import { ExternalReviewersDeletionComplete } from '../types/external-reviewers-deletion-complete';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewersDeletionService {

  constructor(private http: HttpClient) { }
  
  
    getPreviousRequest(serviceCode: string) {
      return this.http.get<AppResponse<ExternalReviewerDeletionRequest[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/${serviceCode}/previous-requests`);
    }
  
  
    getEligibleExternalReviewers(module: string) {
      return this.http.get<AppResponse<ExternalReviewerDeletionRequest[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/${module}`);
    }
  
  
    createRequest(serviceCode: string, externalReviewerDeletionCreate : ExternalReviewerDeletionCreate) {
      return this.http.post<any>(`${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/${serviceCode}/create/`, externalReviewerDeletionCreate);
    }
  
  
    getRequestByRequestIdAndTaskId(requestId: any, taskId: any) {
      return this.http.get<AppResponse<ExternalReviewerDeletionRequest>>(`${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/${requestId}/${taskId}`);
    }
  
  
    complete(completeDto: ExternalReviewersDeletionComplete) {
      return this.http.post<AppResponse<any>>(
        `${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/complete/`, completeDto
      );
    }

    validate(registrationInfoId: number) {
        return this.http.get<AppResponse<void>>(
            `${AppConstants.API.EXTERNAL_REVIEWERS_DELETION_REQUEST}/validate/${registrationInfoId}/`
        );
    }
  }
  
