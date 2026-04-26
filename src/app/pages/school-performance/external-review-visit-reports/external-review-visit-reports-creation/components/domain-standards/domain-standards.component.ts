import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {DomainJudgmentUtilsService} from "../../../../../../shared/domain-evaluation/domain-judgment-utils.service";
import {VisitReportStandardEvaluation} from "../../../../types/visit-report-standard-evaluation";
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'domain-standards',
    templateUrl: './domain-standards.component.html',
    styleUrl: './domain-standards.component.scss'
})
export class DomainStandardsComponent implements OnInit {
    @Output() professionalJudgmentChange = new EventEmitter<{
        domain: VisitReportDomainEvaluation,
        judgment: number
    }>();

    constructor(protected domainJudgmentService: DomainJudgmentUtilsService,
                public translate: TranslateService,
    ) {
    }

    @Input() isEditMode: boolean = false;
    @Input() canEditJudgmentAndJustification: boolean = false;


    @Input() domains: VisitReportDomainEvaluation[] = [];
    @Input() isSchoolCommentEditable: boolean = false;
    judgmentCodeList: any[] = [];

    @Input() isSubmitting = false;


    ngOnInit(): void {
        this.judgmentCodeList = [
            {value: 0, label: this.translate.instant('PAGES.COMMON.LABELS.SELECT')},
            ...Array.from({length: 5}, (_, i) => ({
                value: i + 1,
                label: (i + 1).toString()
            }))
        ];

        this.domains.forEach((domain) => {
            domain.standardEvaluations ??= [];
            this.onStandardJudgmentChange(domain, null);
        });

    }

    onStandardJudgmentChange(domain: VisitReportDomainEvaluation, changedStandardEvaluation: VisitReportStandardEvaluation | null): void {
        const standardJudgment: Record<string, number> = {};
        for (const se of domain.standardEvaluations ?? []) {
            const code = se?.lkStandard?.code;
            if (!code) continue;

            const val = Number(se?.professionalJudgment ?? se?.systemJudgment ?? 0);
            standardJudgment[code] = Number.isFinite(val) ? val : 0;
        }
        const newJudgment = this.domainJudgmentService.evaluateDomainJudgment(standardJudgment, domain.domain as string);
        domain.professionalJudgment = newJudgment;

        this.professionalJudgmentChange.emit({domain, judgment: newJudgment});

        if (changedStandardEvaluation) {
            domain.standardEvaluations?.forEach(standardEvaluation => {
                if (standardEvaluation.standardId === changedStandardEvaluation?.standardId && changedStandardEvaluation?.systemJudgment === changedStandardEvaluation?.professionalJudgment) {
                    standardEvaluation.judgmentChangeJustification = '';
                }
            })
        }
    }


    //-- validate mandatory fields 
    validate(): boolean {
        this.isSubmitting = true;
        let valid = true;
        // Loop through domains to check required fields
        this.domains.forEach(domain => {
            // Example: CKEditor required fields
            if (!domain.strengthsAnalysis?.trim()) valid = false;
            if (!domain.improvementsAnalysis?.trim()) valid = false;
            if (!domain.domainSummary?.trim()) valid = false;

            // Example: Check judgment justification condition
            domain.standardEvaluations?.forEach(stdEval => {
                if (
                    stdEval.professionalJudgment !== stdEval.systemJudgment &&
                    (!stdEval.judgmentChangeJustification ||
                        !stdEval.judgmentChangeJustification.trim())
                ) {
                    valid = false;
                }
            });
        });

        return valid;
    }
}
