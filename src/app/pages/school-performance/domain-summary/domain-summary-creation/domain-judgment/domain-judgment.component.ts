import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomainSummaryService} from '../../../service/domain-summary.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainJudgmentUtilsService} from "../../../../../shared/domain-evaluation/domain-judgment-utils.service";

@Component({
    selector: 'domain-judgment',
    templateUrl: './domain-judgment.component.html',
    styleUrl: './domain-judgment.component.scss'
})
export class DomainJudgmentComponent implements OnInit {
    @Input() domainSummaryRequestInfo: any = {};
    domainNgStyle: any;
    domainJudgment: any;

    constructor(
        public domainSummaryService: DomainSummaryService,
        protected domainJudgmentService: DomainJudgmentUtilsService,
        public translate: TranslateService,
        public toastService: ToastService) {
    }

    ngOnInit(): void {
        if (this.domainSummaryRequestInfo.status !== 'APPROVED') {
            this.getInitStandardsAverages(this.domainSummaryRequestInfo.domain, this.domainSummaryRequestInfo.scheduledSchoolVisitId);
        } else {
            this.domainJudgment = this.getDomainJudgmentValue(this.domainSummaryRequestInfo.judgment);
        }
    }

    getInitStandardsAverages(domain: string, scheduledSchoolVisitId: number) {
        this.domainSummaryService.getInitStandardsAverages(domain, scheduledSchoolVisitId).subscribe({
            next: (response) => {
                this.applyStandardsAverageToSubmissionInfo(response.data);
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    applyStandardsAverageToSubmissionInfo(response: any): void {
        this.domainJudgment = this.getDomainJudgmentValue(response.judgment);
        this.domainSummaryRequestInfo.domain = response.domainCode;
        this.domainSummaryRequestInfo.judgment = response.judgment;
        this.domainSummaryRequestInfo.domainSummaryEvaluations = response.standardAverageList.map((item: any) => ({
            standardId: item.standardId,
            judgment: item.judgment,
            standard: {
                titleAr: item.titleAr,
                titleEn: item.titleEn,
                code: item.code,
                indicators: item.indicators
            }
        }));
    }

    getDomainJudgmentValue(judgment: any): string | null {
        this.domainNgStyle = this.domainJudgmentService.getJudgmentStyles(judgment);
        if (!judgment) {
            return null;
        }
        switch (judgment) {
            case 1: {
                return 'EXCELLENT';
            }
            case 2: {
                return 'GOOD';
            }
            case 3: {
                return 'ACCEPTABLE';
            }
            case 4: {
                return 'UNACCEPTABLE';
            }
            case 5: {
                return 'CRITICAL';
            }
            default: {
                this.domainNgStyle = this.domainJudgmentService.getJudgmentStyles(3);
                return 'ACCEPTABLE';
            }
        }
    }
}