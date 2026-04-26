import {Component, OnInit} from '@angular/core';
import {DomainSummarySubmissionRequestInfo} from '../../types/domain-summary-submission-request-info';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainSummaryService} from '../../service/domain-summary.service';

@Component({
    selector: 'app-domain-summary-creation',
    templateUrl: './domain-summary-creation.component.html',
    styleUrl: './domain-summary-creation.component.scss'
})
export class DomainSummaryCreationComponent implements OnInit {

    infoId: any;
    status: any;
    domain: any;
    isSubmitted = false;
    scheduledSchoolVisitId: any;
    domainSummarySubmissionRequestInfo: DomainSummarySubmissionRequestInfo = {} as DomainSummarySubmissionRequestInfo;

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private router: Router,
        private domainSummaryService: DomainSummaryService) {

    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.infoId = params.get('infoId');
            this.domain = params.get('domain');
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            this.domainSummarySubmissionRequestInfo.scheduledSchoolVisitId = this.scheduledSchoolVisitId;
            this.domainSummarySubmissionRequestInfo.domain = this.domain;
            this.validateDomainSummarySubmission();
            this.domainSummarySubmissionRequestInfo.strengthsAnalysis = '';
            this.domainSummarySubmissionRequestInfo.improvementsAnalysis = '';
            this.domainSummarySubmissionRequestInfo.domainSummary = '';
            /*if (this.infoId) {
                this.getDomainSummaryRequestInfoByInfoId(this.infoId);
            } else {
                this.domainSummarySubmissionRequestInfo.strengthsAnalysis = '';
                this.domainSummarySubmissionRequestInfo.improvementsAnalysis = '';
                this.domainSummarySubmissionRequestInfo.domainSummary = '';
            }*/
        });
    }

    validateDomainSummarySubmission() {
        this.domainSummaryService.validateDomainSummarySubmission(this.domain, this.scheduledSchoolVisitId).subscribe({
            next: (res) => {
                if (this.infoId) {
                    this.getDomainSummaryRequestInfoByInfoId(this.infoId);
                } else {
                    this.domainSummarySubmissionRequestInfo.strengthsAnalysis = '';
                    this.domainSummarySubmissionRequestInfo.improvementsAnalysis = '';
                    this.domainSummarySubmissionRequestInfo.domainSummary = '';
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
                this.router.navigate(['/jawda/school-performance/domain-summary/management', this.scheduledSchoolVisitId]);
            }
        });
    }

    getDomainSummaryRequestInfoByInfoId(id: number) {
        this.domainSummaryService.getDomainSummaryRequestInfoByInfoId(id).subscribe({
            next: (response) => {
                this.domainSummarySubmissionRequestInfo = response.data;
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    validateForm(action: string) {
        this.isSubmitted = true;
        if (!this.domainSummaryService.validateDomainSummaryRequestInfoMandatoryFields(this.domainSummarySubmissionRequestInfo)) {
            scrollTo(0, 0);
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
            return;
        }
        this.save(action);
    }

    save(action: string) {
        this.domainSummaryService.saveDomainSummaryRequestInfo(this.domainSummarySubmissionRequestInfo, action)
            .subscribe({
                next: (response) => {
                    if (action === 'SAVE') {
                        this.toastService.show(
                            this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                                classname: 'bg-success text-white',
                                delay: 3000
                            }
                        );
                        this.router.navigate(['/jawda/school-performance/domain-summary/creation', response.domainSummarySubmissionRequestInfo.domain, response.domainSummarySubmissionRequestInfo.id, response.domainSummarySubmissionRequestInfo.scheduledSchoolVisitId]);
                    } else {
                        this.router.navigate(['/jawda/success-page'], {
                            state: {requestApplicationNo: response.applicationNo, action: action}
                        });
                    }
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
                }
            });
    }
}
