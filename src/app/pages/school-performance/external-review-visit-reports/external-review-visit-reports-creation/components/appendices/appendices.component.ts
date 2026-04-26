import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    BasicSchoolInfo,
    ContactInfo,
    GradeLevels,
    PrincipalInfo,
    SchoolInfo,
    SchoolSchedule
} from 'src/app/pages/school-performance/types/school-info';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {right} from "@popperjs/core";

@Component({
    selector: 'appendices',
    templateUrl: './appendices.component.html',
    styleUrl: './appendices.component.scss'
})
export class AppendicesComponent implements OnInit {


    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;


    @Input() showButtons: boolean = true;
    @Input() showSaveBtn: boolean = true;
    @Input() isEditMode: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();


    school: any = {};

    activeTab: string = 'general-data';


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
            id: 'teaching-staff',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.TEACHING_STAFF_NUMBERS',
            route: 'teaching-staff'
        },
        {
            id: 'evidence-collection-forms-statistics',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.EVIDENCE_COLLECTION_STATS',
            route: 'evidence-collection-forms-statistics'
        }

    ];

    constructor(private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService) {
    }

    ngOnInit(): void {
        if (!this.visitReportSubmissionRequestInfo.editableSchoolInfo) {
            this.visitReportSubmissionRequestInfo.editableSchoolInfo = {} as SchoolInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.basicInfo = {} as BasicSchoolInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.principalInfo = {} as PrincipalInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.gradeLevels = {} as GradeLevels;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.contactInfo = {} as ContactInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.localSchoolSchedule = {} as SchoolSchedule;
        }
        this.school = {...this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school};
    }


    selectTab(tab: any): void {
        this.activeTab = tab.id;
    }


    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    protected readonly right = right;
    protected readonly String = String;
}
