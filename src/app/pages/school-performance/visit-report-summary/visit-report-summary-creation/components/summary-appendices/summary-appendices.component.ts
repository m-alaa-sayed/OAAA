import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {VisitReportSummaryService} from 'src/app/pages/school-performance/service/visit-report-summary.service';
import {
    BasicSchoolInfo,
    ContactInfo,
    GradeLevels,
    PrincipalInfo,
    SchoolInfo,
    SchoolSchedule
} from 'src/app/pages/school-performance/types/school-info';
import {SummaryVisitReportRequest} from 'src/app/pages/school-performance/types/summary-visit-report-request';
import {
    SummaryVisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import {BaseModal} from 'src/app/shared/base-modal';
import {VisitReportSummaryWizardService} from "../../../../service/visit-report-summary-wizard.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'summary-appendices',
    templateUrl: './summary-appendices.component.html',
    styleUrl: './summary-appendices.component.scss'
})
export class SummaryAppendicesComponent extends BaseModal implements OnInit {

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

    @Input() showButtons: boolean = true;
    @Input() showSaveBtn: boolean = true;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    showSubmitBtn: boolean = true;

    school: any = {};

    activeTab: string = 'general-data';
    isSubmitting = false;
    tabs = [
        {
            id: 'general-data',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.GENERAL_SCHOOL_DATA',
            route: 'general-data'
        },
        {
            id: 'student-data',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.STUDENT_DATA',
            route: 'student-data'
        },
        {
            id: 'staff-data',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.STAFF_DATA',
            route: 'staff-data'
        }
    ];

    subscription!: Subscription;

    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private router: Router,
        private visitReportSummaryWizardService: VisitReportSummaryWizardService,
        private visitReportSummaryService: VisitReportSummaryService,
        public override modalService: NgbModal
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        if (!this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo) {
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo = {} as SchoolInfo;
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo.basicInfo = {} as BasicSchoolInfo;
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo.principalInfo = {} as PrincipalInfo;
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo.gradeLevels = {} as GradeLevels;
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo.contactInfo = {} as ContactInfo;
            this.summaryVisitReportSubmissionRequestInfo.editableSchoolInfo.localSchoolSchedule = {} as SchoolSchedule;
        }
        this.school = {...this.summaryVisitReportSubmissionRequestInfo.scheduledSchoolVisit?.school};
        this.showSubmitBtn = !['REPORT_REJECTED', 'APPROVED'].includes(String((this.summaryVisitReportSubmissionRequestInfo.status)));
        this.subscription = this.visitReportSummaryWizardService.summaryVisitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    selectTab(tab: any): void {
        this.activeTab = tab.id;
    }

    submit() {
        this.close();
        const summaryVisitReportRequest: SummaryVisitReportRequest = {
            action: 'SUBMIT',
            summaryVisitReportSubmissionRequestInfoDto: this.summaryVisitReportSubmissionRequestInfo
        };
        this.visitReportSummaryService.saveSummaryVisitReportRequest(summaryVisitReportRequest).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: response.data, action: 'SUBMIT'}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    validate(contant: any) {
        if (!this.visitReportSummaryWizardService.isValid(this.summaryVisitReportSubmissionRequestInfo)) return;
        this.open(contant)
    }

    saveTemp() {
        this.visitReportSummaryWizardService.saveTempObject(this.summaryVisitReportSubmissionRequestInfo).subscribe({
            next: (res) => {
                this.summaryVisitReportSubmissionRequestInfo = res.summaryVisitReportSubmissionRequestInfoDto
            }
        });
    }
}
