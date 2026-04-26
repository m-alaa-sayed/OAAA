import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalReviewerTrainingResultRequest } from '../types/external-reviewer-training-result-request';
import { AppResponse } from 'src/app/core/models/app-response';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ExternalReviewersRegistrationRequest } from '../types/external-reviewers-registration-request';
import { ExternalReviewersTrainingResultsComplete } from '../types/external-reviewers-training-results-complete';
import { ExternalReviewerTrainingResultCreate } from '../types/external-reviewer-training-result-create';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewersTrainingService {

  constructor(private http: HttpClient) { }


  getPreviousRequest(serviceCode: string) {
    return this.http.get<AppResponse<ExternalReviewerTrainingResultRequest[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_TRAINING_REQUEST}/${serviceCode}/previous-requests`);
  }


  getEligibleExternalReviewers(serviceCode: string) {
    return this.http.get<AppResponse<ExternalReviewersRegistrationRequest[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_TRAINING_REQUEST}/${serviceCode}`);
  }


  createRequest(serviceCode: string, externalReviewerTrainingResultCreate : ExternalReviewerTrainingResultCreate) {
    return this.http.post<any>(`${AppConstants.API.EXTERNAL_REVIEWERS_TRAINING_REQUEST}/${serviceCode}/create/`, externalReviewerTrainingResultCreate);
  }


  getRequestByRequestIdAndTaskId(requestId: any, taskId: any) {
    return this.http.get<AppResponse<ExternalReviewerTrainingResultRequest>>(`${AppConstants.API.EXTERNAL_REVIEWERS_TRAINING_REQUEST}/${requestId}/${taskId}`);
  }


  complete(completeDto: ExternalReviewersTrainingResultsComplete) {
    return this.http.post<AppResponse<any>>(
      `${AppConstants.API.EXTERNAL_REVIEWERS_TRAINING_REQUEST}/complete/`, completeDto
    );
  }
}
