import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../../../core/constants/app-constants";
import {
    ExternalReviewInterviewResultInfo
} from "../types/external-reviewers-interview-result/external-review-interview-result-info";
import {map} from "rxjs";
import {AppResponse} from "../../../core/models/app-response";
import {
    ExternalReviewersInterviewRegistrationInfo
} from "../types/external-reviewers-interview-result/external-reviewers-interview-registration-info";

@Injectable({
    providedIn: 'root'
})
export class ExternalReviewersInterviewResultService {

    constructor(private http: HttpClient) {
    }

    getExternalReviewersInterviewResultsRegistration() {
        return this.http.get<AppResponse<ExternalReviewersInterviewRegistrationInfo[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_INTERVIEW_RESULTS_REGISTRATION}`)
            .pipe(map((ret) => ret.data));
    }

    submitExternalReviewersInterviewResultsRegistration(dto: ExternalReviewInterviewResultInfo) {
        return this.http.post<AppResponse<void>>(`${AppConstants.API.EXTERNAL_REVIEWERS_INTERVIEW_RESULTS_REGISTRATION}`, dto)
    }
}
