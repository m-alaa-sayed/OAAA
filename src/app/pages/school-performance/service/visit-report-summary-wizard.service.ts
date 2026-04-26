import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {BaseWizardService} from 'src/app/shared/wizard-template/base-wizard.service';
import {VisitReportSummaryService} from './visit-report-summary.service';
import {SummaryVisitReportRequest} from '../types/summary-visit-report-request';
import {SummaryVisitReportSubmissionRequestInfo} from '../types/summary-visit-report-submission-request-info';
import {Permission} from "../../../core/enum/permission";
import {AuthService} from "../../../core/services/auth.service";
import {BehaviorSubject} from "rxjs";
import { catchError, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VisitReportSummaryWizardService extends BaseWizardService {

    private summaryVisitReportSubmissionDataSubject = new BehaviorSubject<boolean>(false);
    public summaryVisitReportSubmissionData$ = this.summaryVisitReportSubmissionDataSubject.asObservable();

    constructor(public toastService: ToastService,
                public translate: TranslateService,
                private router: Router,
                private authService: AuthService,
                private visitReportSummaryService: VisitReportSummaryService) {
        super();
    }

    protected submit(formData: any) {
    }

    getCancelUrl(): string {
        return "/jawda/school-performance/visit-report-summary/list";
    }


    saveTempObject(summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo) {
        const summaryVisitReportRequest: SummaryVisitReportRequest = {
            action: 'SAVE',
            summaryVisitReportSubmissionRequestInfoDto: summaryVisitReportSubmissionRequestInfo
        };

        const req$ = this.visitReportSummaryService.saveSummaryVisitReportRequest(summaryVisitReportRequest)
            .pipe(
                tap((response) => {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'),
                        {classname: 'bg-success text-white', delay: 3000}
                    );
                    this.router.navigate([
                        '/jawda/school-performance/visit-report-summary/creation',
                        response.summaryVisitReportSubmissionRequestInfoDto.id
                    ]);
                }),
                catchError((error) => {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
                        {classname: 'bg-danger text-white', autohide: false}
                    );
                    return throwError(() => error);
                }),
                shareReplay({bufferSize: 1, refCount: true})
            );
        req$.subscribe();
        return req$;
    }


    /*saveTempObject(summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo) {
        const summaryVisitReportRequest: SummaryVisitReportRequest = {
            action: 'SAVE',
            summaryVisitReportSubmissionRequestInfoDto: summaryVisitReportSubmissionRequestInfo
        };

        this.visitReportSummaryService.saveSummaryVisitReportRequest(summaryVisitReportRequest).subscribe({
            next: (response) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                    classname: 'bg-success text-white',
                    delay: 3000
                });
                this.router.navigate(['/jawda/school-performance/visit-report-summary/creation', response.summaryVisitReportSubmissionRequestInfoDto.id]);
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }*/

    checkVisitReportPermission(permission: Permission): boolean {
        const userClaim = this.authService.getUserClaim();
        return <boolean>userClaim?.permissions?.includes(permission);
    }

    isValid(summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo) {
        if (!summaryVisitReportSubmissionRequestInfo.improvementsAnalysis || summaryVisitReportSubmissionRequestInfo.improvementsAnalysis?.trim() === ''
            || !summaryVisitReportSubmissionRequestInfo.recommendations || summaryVisitReportSubmissionRequestInfo.recommendations?.trim() === ''
            || !summaryVisitReportSubmissionRequestInfo.strengthsAnalysis || summaryVisitReportSubmissionRequestInfo.strengthsAnalysis?.trim() === ''
            || !summaryVisitReportSubmissionRequestInfo.summary || summaryVisitReportSubmissionRequestInfo.summary?.trim() === '') {
            this.summaryVisitReportSubmissionDataSubject.next(true);
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            scrollTo(0, 0);
            return false;
        }
        return true;
    }
}
