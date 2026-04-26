import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {VisitFormService} from '../../service/visit-form.service';
import {Permission} from 'src/app/core/enum/permission';
import {formatDate} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseModal} from 'src/app/shared/base-modal';
import {LanguageUtil} from "../../../../core/util/language.util";
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-visit-form-management',
    templateUrl: './visit-form-management.component.html',
    styleUrl: './visit-form-management.component.scss'
})
export class VisitFormManagementComponent extends BaseModal implements OnInit {

    @ViewChild('delete') deleteTemplate!: TemplateRef<any>;

    title = '';
    previousState: any;
    visitFormListPageTitle = '';
    visitFormListLink = '';
    visitData: any;
    isReport: boolean = false;
    scheduledSchoolVisitId: any;
    type: any;
    columns: any[] = [];
    actions: any[] = [];
    list: any[] = [];
    protected readonly Permission = Permission;
    selectedRow: any;

    constructor(
        public translate: TranslateService,
        private router: Router,
        public toastService: ToastService,
        private route: ActivatedRoute,
        public override modalService: NgbModal,
        private authService: AuthService,
        private visitFormService: VisitFormService) {
        super(modalService);
        const {
            visitData = null,
            isReport = false,
            visitFormListPageTitleAr = '',
            visitFormListPageTitleEn = ''
        } = history.state ?? {};
        this.visitData = visitData;
        this.isReport = isReport;
        this.visitFormListPageTitle = LanguageUtil.isArabic ? visitFormListPageTitleAr : visitFormListPageTitleEn;
        this.previousState = {
            ...history.state,
            pageTitleAr: visitFormListPageTitleAr,
            pageTitleEn: visitFormListPageTitleEn
        };
    }

    ngOnInit(): void {
        this.visitData
            ? this.visitFormService.setVisitData(this.visitData)
            : this.visitData = this.visitFormService.getVisitData();
        this.route.paramMap.subscribe(params => {
            const type = params.get('type') ?? '';
            const scheduledSchoolVisitId = params.get('id');
            const basePath = `/jawda/school-performance/visit-form/${type}`;
            this.type = type;
            this.scheduledSchoolVisitId = scheduledSchoolVisitId;
            this.visitFormListPageTitle = !this.isReport ? `MENUITEMS.MENU.${type}_FORM` : this.visitFormListPageTitle;
            this.visitFormListLink = `${basePath}${this.isReport ? '/report' : ''}/list`;
            this.title = `MENUITEMS.MENU.${type}_FORM_MANAGEMENT${this.isReport ? '_REPORT' : ''}`;
            this.getVisitFormRequestInfoByScheduledSchoolVisitId(type, scheduledSchoolVisitId);
        });
        this.prepareGridHeaderCols();
    }

    getVisitFormRequestInfoByScheduledSchoolVisitId(visitFormType: any, scheduledSchoolVisitId: any): void {
        this.visitFormService.getVisitFormRequestInfoByScheduledSchoolVisitId(visitFormType, scheduledSchoolVisitId).subscribe({
            next: (res) => this.list = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    private prepareGridHeaderCols() {
        const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
        
        this.columns = [
            {
                field: 'formCode',
                headerName: 'PAGES.VISIT_FORM.LABELS.FORM_CODE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'user.fullNameAr' : 'user.fullNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SUBMITTED_BY',

            },
            {
                field: 'createdOn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SUBMISSION_DATE',
                valueGetter: (params: any) => {
                    const createdOn = params.data?.createdOn;
                    if (!createdOn) return '';
                    const cleanedDate = createdOn.split('.')[0];
                    return formatDate(cleanedDate, 'dd/MM/yyyy', 'en-US');
                }
            },
            ...(this.type === "CLASSROOM_OBSERVATION" ? [
                {
                    field: 'subject',
                    headerName: 'PAGES.VISIT_FORM.LABELS.SUBJECT',
                    valueGetter: (params: any) => {
                        return params.data.subject ? this.translate.instant('PAGES.VISIT_FORM.CLASSROOM_OBSERVATION.' + params.data.subject) : '';
                    }
                },
                {
                    field: 'grade',
                    headerName: 'PAGES.VISIT_FORM.LABELS.GRADE',

                },
                {
                    field: 'className',
                    headerName: 'PAGES.VISIT_FORM.LABELS.SECTION',

                },
                {
                    field: 'sessionNumber',
                    headerName: 'PAGES.VISIT_FORM.LABELS.CLASS_PERIOD',

                },
                {
                    field: 'attendanceCount',
                    headerName: 'PAGES.VISIT_FORM.LABELS.ATTENDANCE',

                },
                {
                    field: 'absenceCount',
                    headerName: 'PAGES.VISIT_FORM.LABELS.ABSENCE',
                },
            ] : []),
            ...(this.type === "GENERAL_EVIDENCE" ? [
                {
                    field: 'activityType',
                    headerName: 'PAGES.VISIT_FORM.LABELS.ACTIVITY_TYPE',
                    valueGetter: (params: any) => {
                        return this.translate.instant('PAGES.VISIT_FORM.LABELS.' + params.data.activityType?.toUpperCase());
                    }

                }
            ] : []),
            {
                field: 'formStatus',
                headerName: 'PAGES.VISIT_FORM.LABELS.STATUS',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.VISIT_FORM.LABELS.' + params.data.formStatus.toUpperCase());
                }
            },
            {
                field: 'visitFormAttachments',
                headerName: 'PAGES.COMMON.LABELS.HAS_ATTACHMENTS',
                valueGetter: (params: any) => {
                    return params.data.visitFormAttachments.length > 0 ?
                        this.translate.instant('PAGES.COMMON.LABELS.YES') : this.translate.instant('PAGES.COMMON.LABELS.NO');
                }
            },
            {
                field: 'hasComments',
                headerName: 'PAGES.COMMON.LABELS.HAS_COMMENTS',
                valueGetter: (params: any) => {
                    return params.data.hasComments ? this.translate.instant('PAGES.COMMON.LABELS.YES') : this.translate.instant('PAGES.COMMON.LABELS.NO');
                }
            }
        ];

        const t = (k: string) => this.translate.instant(k);

        const download = {
            label: t('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-printer-fill',
            callback: ({data}: any) => this.downloadReport(data),
            show: () => this.type == 'GENERAL_EVIDENCE' ? userPermissions.includes(Permission.GENERAL_EVIDENCE_VISIT_REPORT_EXPORT) : userPermissions.includes(Permission.CLASSROOM_OBSERVATION_VISIT_REPORT_EXPORT)
        };

        const details = {
            label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
            icon: 'ri-eye-fill',
            callback: (row: any) => this.openDetails(row),
            show: () => this.type == 'GENERAL_EVIDENCE' ? userPermissions.includes(Permission.GENERAL_EVIDENCE_VISIT_FORM_VIEW_WITHIN_VISITS) : userPermissions.includes(Permission.CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_WITHIN_VISITS)
        };

        const deleteForm = {
            label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
            icon: 'ri-delete-bin-fill',
            callback: (row: any) => this.openDeletePop(row)
        };

        this.actions = this.isReport ? [download] : [details, deleteForm, download];
    }

    openDetails(row: any) {
        if (row.data.requestId == null) {
            this.router.navigate(['/jawda/school-performance/visit-form', this.type, 'creation', row.data.id, 'PROCESSING'], {state: {visitData: this.visitData}})
        } else {
            this.router.navigate(['/jawda/school-performance/visit-form/details', row.data.requestId]);
        }
    }

    openDeletePop(row: any) {
        this.selectedRow = row;
        this.modalService.open(this.deleteTemplate, {
            backdrop: 'static',
            centered: true
        });
    }

    removeForm(row: any) {
        this.visitFormService.deleteVisitForm(this.type, row.data.id).subscribe({
            next: () => {
                this.close();
                this.getVisitFormRequestInfoByScheduledSchoolVisitId(this.type, row.data.scheduledSchoolVisitId);
            },
            error: (error) => {
                this.close();
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            },
        });
    }

    addNewForm() {
        this.visitFormService.validateVisitPlanStatus(this.type, this.visitData.scheduledSchoolVisitId).subscribe({
            next: (res) => this.router.navigate(['/jawda/school-performance/visit-form', this.type, 'creation', this.scheduledSchoolVisitId, 'INITIATE'],
                {state: {visitData: this.visitData}}
            ),
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    private downloadReport(row: any) {
        if (!row.formStatus || row.formStatus === 'PROCESSING') {
            this.showErrorMessage('PAGES.VISIT_FORM.MESSAGES.REPORT_NOT_AVAILABLE');
            return;
        }
        this.visitFormService.downloadPdfReport(row.id, this.type).subscribe({
            next: value => this.downloadFile(value.data),
            error: err => this.showErrorMessage('PAGES.COMMON.MESSAGES.' + err)
        });
    }

    private downloadFile(fileDto: any) {
        const dataUri = 'data:application/pdf;base64,' + fileDto.file;
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = dataUri;
        a.download = fileDto.fileName;
        a.click();
        window.URL.revokeObjectURL(dataUri);
    }

    private showErrorMessage(message: string) {
        scrollTo(0, 0);
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }
}
