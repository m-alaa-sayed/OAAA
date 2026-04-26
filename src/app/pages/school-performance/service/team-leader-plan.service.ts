import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AppResponse} from 'src/app/core/models/app-response';
import {VisitPlanOverview} from '../types/visit-plan-overview';
import {ScheduledSchoolVisit} from '../types/scheduled-school-visit';
import {VisitPlanRequestInfo} from '../types/visit-plan-request-info';
import {ReviewTeamAssignmentRequestInfo} from '../types/review-team-assignment-request-info';
import {VisitPlanProcessCompletionRequest} from '../types/visit-plan-process-completion-request';
import {VisitDomain} from "../../../core/enum/visit-domain";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TeamLeaderPlanService {

    constructor(private http: HttpClient) {
    }

    getCurrentPlansOverview() {
        return this.http.get<AppResponse<VisitPlanOverview[]>>(`${AppConstants.API.VISIT_PLAN}`);
    }

    availableForPlanning() {
        return this.http.get<AppResponse<ScheduledSchoolVisit[]>>(`${AppConstants.API.AVAILABLE_FOR_PLANNING}`);
    }

    getPlanDetails(planeId: number) {
        return this.http.get<AppResponse<VisitPlanRequestInfo>>(`${AppConstants.API.PLAN_DETAILS}${planeId}`);
    }

    handleVisitPlanRequest(visitPlanCreationRequestDto: any) {
        return this.http.post<AppResponse<any>>(`${AppConstants.API.VISIT_PLAN}`, visitPlanCreationRequestDto);
    }

    updateVisitPlanRequest(visitPlanCreationRequestDto: any) {
        return this.http.put<AppResponse<any>>(`${AppConstants.API.VISIT_PLAN}update`, visitPlanCreationRequestDto);
    }

    getVisitTeamMembers(visitId: number) {
        return this.http.get<AppResponse<ReviewTeamAssignmentRequestInfo[]>>(`${AppConstants.API.VISIT_TEAM_MEMBERS}${visitId}`);
    }

    getRequestByRequestIdAndTaskId(requestId: any, taskId: any) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.PLAN_DETAILS_REQUEST}/${requestId}/${taskId}`);
    }

    completeVisitPlanProcess(requestObject: VisitPlanProcessCompletionRequest) {
        return this.http.put<AppResponse<any>>(
            `${AppConstants.API.PLAN_DETAILS_COMPLETE}`, requestObject
        );
    }

    downloadMemberTasksReport(visitPlanRequestInfoId: number | undefined, reviewTeamAssignmentRequestInfoIds: number[]) {
        return this.http.post<AppResponse<any>>(`${AppConstants.API.VISIT_PLAN}report/tasks/${visitPlanRequestInfoId}`, reviewTeamAssignmentRequestInfoIds);
    }

    downloadReport(id: number) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.VISIT_PLAN}report/${id}`);
    }
}
