import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {JudgmentCode} from 'src/app/core/enum/judgment-code';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BaseModal} from "../../../../../../shared/base-modal";
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {
    OnJudgmentChangeUtilsService
} from "../../../../../../shared/domain-evaluation/on-judgment-change-utils.service";
import {VisitDomain} from "../../../../../../core/enum/visit-domain";
import {Subscription} from "rxjs";

@Component({
    selector: 'overall-school-performance',
    templateUrl: './overall-school-performance.component.html',
    styleUrl: './overall-school-performance.component.scss'
})
export class OverallSchoolPerformanceComponent extends BaseModal implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() schoolView: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() showAttachments: boolean = true;
    @Input() canEditJudgmentAndJustification: boolean = false;
    @Input() importedDomainSummary: any[] = [];
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    isLoadingDomains = false;
    protected JudgmentCode = JudgmentCode;

    @ViewChild("submitForm") submitForm?: NgForm;

    isSubmitting = false;
    selectedFileName: any;
    selectedFile: File | null = null;
    subscription!: Subscription;


    constructor(private commonService: CommonService,
                private toastService: ToastService,
                public translate: TranslateService,
                public override modalService: NgbModal,
                public onJudgmentChangeUtilsService: OnJudgmentChangeUtilsService,
                private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.onJudgmentChangeUtilsService.judgmentChange$.subscribe(evt => {
            this.onDomainJudgmentChange(evt);
        });
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadFile();
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            console.warn('No file selected');
            return;
        }
        const bucket = 'oaaaqa';
        this.commonService.uploadFileToOci(bucket, this.selectedFile)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    this.visitReportSubmissionRequestInfo.judgmentChangeAttachmentBucketName = data.bucketName;
                    this.visitReportSubmissionRequestInfo.judgmentChangeAttachmentFileName = data.objectName;
                },
                error: (error) => {
                    console.error('Error uploading file:', error);
                }
            });
    }

    downloadUploadedFile(objectName: any, bucketName: any): void {
        if (!objectName || !bucketName) {
            console.warn('Missing file data');
            return;
        }

        this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
            .subscribe({
                next: (res) => {
                    const downloadUrl = res.data;

                    fetch(downloadUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('File download failed.');
                            }
                            return response.blob();
                        })
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = objectName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(err => {
                            console.error('Download via blob failed:', err);
                        });
                },
                error: (err) => {
                    console.error('Download failed:', err);
                }
            });
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    importFromDomainSummary(content: any) {
        // if (this.importedDomainSummary.length == 0)
        //     this.getDomainSummary();
        this.modalService.open(content, {centered: true, size: 'xl'});
    }

    calculateOverallJudgment(): number {
        const getJudgment = (domainName: VisitDomain): number => {
            const found = this.visitReportSubmissionRequestInfo.domainEvaluations?.find(d => d.domain === domainName);
            return found?.professionalJudgment ?? 0;
        };

        const academic = getJudgment(VisitDomain.ACADEMIC_ACHIEVEMENT);
        const teaching = getJudgment(VisitDomain.TEACHING_AND_ASSESSMENT);
        const leadership = getJudgment(VisitDomain.LEADERSHIP_AND_GOVERNANCE);
        const personal = getJudgment(VisitDomain.PERSONAL_DEVELOPMENT);
        const environment = getJudgment(VisitDomain.LEARNING_ENVIRONMENT);

        // Urgent intervention (any core domain is 5)
        if (academic === 5 || teaching === 5 || leadership === 5) return 5;

        // Inadequate due to personal or climate being 5
        if (personal === 5 || environment === 5) return 4;

        // Inadequate due to one core domain being 4
        if (academic === 4 || teaching === 4 || leadership === 4) return 4;

        // Adequate
        if (
            (academic === 3 || teaching === 3 || leadership === 3) &&
            academic <= 3 && teaching <= 3 && leadership <= 3 &&
            personal <= 4 && environment <= 4
        ) return 3;

        // Good
        if (
            (academic === 2 || teaching === 2 || leadership === 2) &&
            academic <= 2 && teaching <= 2 && leadership <= 2 &&
            personal <= 3 && environment <= 3
        ) return 2;

        // Excellent
        if (
            academic === 1 && teaching === 1 && leadership === 1 &&
            personal <= 2 && environment <= 2
        ) return 1;

        return 0;
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.visitReportSubmissionRequestInfo.domainEvaluations?.forEach((domain) => {
            if (domain.domain === event.domain.domain) {
                domain.professionalJudgment = event.domain.professionalJudgment === 0 ? null : event.domain.professionalJudgment;
            }
        })
        this.visitReportSubmissionRequestInfo.overallProfessionalJudgment = this.calculateOverallJudgment();
    }

    addAttchment(attachmentObject: any) {
        if (!this.visitReportSubmissionRequestInfo.attachments) {
            this.visitReportSubmissionRequestInfo.attachments = []
        }
        this.visitReportSubmissionRequestInfo.attachments.push(attachmentObject);
    }

    removeAttchment(index: number) {
        this.visitReportSubmissionRequestInfo.attachments?.splice(index, 1);
    }
}
