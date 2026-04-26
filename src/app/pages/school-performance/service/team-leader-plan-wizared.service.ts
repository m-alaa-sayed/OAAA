import {Injectable} from '@angular/core';
import {BaseWizardService} from 'src/app/shared/wizard-template/base-wizard.service';
import {VisitPlanRequestInfo} from '../types/visit-plan-request-info';
import {TeamLeaderPlanService} from './team-leader-plan.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from "rxjs";
import {VisitDomain} from "../../../core/enum/visit-domain";

@Injectable({
    providedIn: 'root'
})
export class TeamLeaderPlanWizaredService extends BaseWizardService {

    private visitPlanRequestInfoDataSubject = new BehaviorSubject<boolean>(false);
    public visitPlanRequestInfoData$ = this.visitPlanRequestInfoDataSubject.asObservable();

    constructor(private teamLeaderPlanService: TeamLeaderPlanService,
                private router: Router,
                public translate: TranslateService,
                private toastService: ToastService,
    ) {
        super();
    }

    protected submit(formData: any) {
    }

    saveTempObject(visitPlanRequestInfo: VisitPlanRequestInfo, action: string, taskId?: any) {
        const visitPlanCreationRequestDto: any = {
            action: action,
            visitPlanRequestInfoDto: visitPlanRequestInfo
        };
        this.teamLeaderPlanService.handleVisitPlanRequest(visitPlanCreationRequestDto).subscribe({
            next: (response) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                    classname: 'bg-success text-white',
                    delay: 3000
                });
                if (taskId) {
                    this.router.navigate(['/jawda/school-performance/team-leader-plan/request-details', visitPlanRequestInfo.requestId, taskId]);
                } else {
                    this.router.navigate(['/jawda/school-performance/team-leader-plan/creation', response.data.id]);
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    getCancelUrl(): string {
        return "/jawda/school-performance/team-leader-plan/list";
    }

    downloadMemberTasksReport(visitPlanRequestInfoId: number | undefined, reviewTeamAssignmentRequestInfoIds: number[]) {
        return this.teamLeaderPlanService.downloadMemberTasksReport(visitPlanRequestInfoId, reviewTeamAssignmentRequestInfoIds);
    }

    validateAllDomainsSelected(visitPlanRequestInfo: VisitPlanRequestInfo) {
        const hasInvalidDomainOrSubject = visitPlanRequestInfo.domainResponsibilities?.some(d => d.role !== "LEADER" && (!d.domains || d.domains.length === 0 || !d.subjects || d.subjects.length === 0));

        if (hasInvalidDomainOrSubject) {
            this.showMandatoryFieldErrorMessage('PAGES.TEAM_LEADER_PLAN.MESSAGES.ALL_DOMAINS_REQUIRED');
            return false;
        }

        const selectedDomains = new Set<string>();
        const visitDomainOptions = Object.values(VisitDomain);
        visitPlanRequestInfo?.domainResponsibilities?.forEach(domainRow => {
            if (Array.isArray(domainRow.domains)) {
                domainRow.domains.forEach(d => selectedDomains.add(d));
            }
        });

        const areAllDomainsSelected = visitDomainOptions.every(opt => selectedDomains.has(opt))
        if (!areAllDomainsSelected) {
            this.showMandatoryFieldErrorMessage('PAGES.TEAM_LEADER_PLAN.MESSAGES.ALL_DOMAINS_REQUIRED');
            return false;
        }
        return true;
    }

    showMandatoryFieldErrorMessage(msg: string) {
        this.visitPlanRequestInfoDataSubject.next(true);
        this.toastService.show(this.translate.instant(msg), {
            classname: 'bg-danger text-white',
            autohide: false
        });
        scrollTo(0, 0);
    }
}
