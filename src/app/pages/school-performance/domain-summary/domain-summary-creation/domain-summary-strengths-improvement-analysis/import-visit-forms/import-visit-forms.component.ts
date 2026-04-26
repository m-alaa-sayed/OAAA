import {Component, Input, OnInit} from '@angular/core';
import {LanguageUtil} from "../../../../../../core/util/language.util";
import {TranslateService} from "@ngx-translate/core";
import {Permission} from "../../../../../../core/enum/permission";
import {ExcelExportService} from "../../../../../../shared/report/services/excel.service";
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-import-visit-forms',
    templateUrl: './import-visit-forms.component.html',
    styleUrl: './import-visit-forms.component.scss'
})
export class ImportVisitFormsComponent implements OnInit {

    protected readonly Permission = Permission;

    @Input() importVisitForms: any[] = [];
    paginatedImportVisitForms: any[] = [];

    pageSize: number = 5;
    currentPage: number = 1;

    // Column toggle configuration
    columns = [
        {field: 'formNumber', label: 'PAGES.DOMAIN_SUMMARY.LABELS.FORM_NUMBER', visible: true},
        {field: 'formType', label: 'PAGES.DOMAIN_SUMMARY.LABELS.FORM_TYPE', visible: true},
        {field: 'formSubmitter', label: 'PAGES.DOMAIN_SUMMARY.LABELS.FORM_SUBMITTER', visible: true},
        {field: 'formDate', label: 'PAGES.DOMAIN_SUMMARY.LABELS.FORM_DATE', visible: true},
        {field: 'strengths', label: 'PAGES.DOMAIN_SUMMARY.LABELS.POSITIVE_ASPECTS_OR_STRENGTHS', visible: true},
        {field: 'improvements', label: 'PAGES.DOMAIN_SUMMARY.LABELS.AREAS_FOR_IMPROVEMENT', visible: true},
        {field: 'details', label: 'PAGES.VISIT_FORM.LABELS.DETAILS', visible: true},
        {field: 'summary', label: 'PAGES.VISIT_FORM.LABELS.SUMMARY', visible: true},
        {field: 'academicAchievement', label: 'PAGES.COMMON.LABELS.ACADEMIC_ACHIEVEMENT', visible: true},
        {field: 'personalDevelopment', label: 'PAGES.COMMON.LABELS.PERSONAL_DEVELOPMENT', visible: true},
        {field: 'teachingAssessment', label: 'PAGES.COMMON.LABELS.TEACHING_AND_ASSESSMENT', visible: true},
        {field: 'learningEnvironment', label: 'PAGES.COMMON.LABELS.LEARNING_ENVIRONMENT', visible: true},
        {field: 'leadershipGovernance', label: 'PAGES.COMMON.LABELS.LEADERSHIP_AND_GOVERNANCE', visible: true}
    ];

    protected readonly LanguageUtil = LanguageUtil;

    constructor(public translate: TranslateService,
                private excelExportService: ExcelExportService) {
    }

    ngOnInit(): void {
        this.updatePagination();
    }

    getNotes(domain: string, evals: any[]): any[] {
        return evals
            .filter(e => e.standard.domain === domain && e.notes?.trim() !== '')
            .map(e => [(LanguageUtil.isArabic ? e.standard.titleAr : e.standard.titleEn), e.notes]);
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedImportVisitForms = this.importVisitForms.slice(startIndex, endIndex);
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updatePagination();
    }

    downloadExcel() {
        const rows = this.importVisitForms.map(form => {
            const row = {
                formCode: form.formCode,
                type: this.translate.instant('PAGES.VISIT_FORM.LABELS.' + form.type),
                fullName: LanguageUtil.isArabic ? form.fullNameAr : form.fullNameEn,
                createdOn: LanguageUtil.isArabic ? formatDate(form.createdOn, 'yyyy-MM-dd hh:mm a', 'en')
                    : formatDate(form.createdOn, 'dd-MM-yyyy hh:mm a', 'en'),
                subject: form.subject?.trim() === '' ? form.otherSubject : form.subject,
                activityType: form.activityType?.trim() === '' ? form.customActivityName : form.activityType,
                strengthsAnalysis: this.excelExportService.htmlToText(form.strengthsAnalysis),
                improvementsAnalysis: this.excelExportService.htmlToText(form.improvementsAnalysis),
                details: this.excelExportService.htmlToText(form.details),
                summary: this.excelExportService.htmlToText(form.summary),
                ACADEMIC_ACHIEVEMENT: this.getDomainLabelValue('ACADEMIC_ACHIEVEMENT', form.visitFormDomainEvaluations),
                PERSONAL_DEVELOPMENT: this.getDomainLabelValue('PERSONAL_DEVELOPMENT', form.visitFormDomainEvaluations),
                TEACHING_AND_ASSESSMENT: this.getDomainLabelValue('TEACHING_AND_ASSESSMENT', form.visitFormDomainEvaluations),
                LEARNING_ENVIRONMENT: this.getDomainLabelValue('LEARNING_ENVIRONMENT', form.visitFormDomainEvaluations),
                LEADERSHIP_AND_GOVERNANCE: this.getDomainLabelValue('LEADERSHIP_AND_GOVERNANCE', form.visitFormDomainEvaluations),
            };
            return row;
        });

        const fields = [
            'formCode',
            'type',
            'fullName',
            'createdOn',
            'subject',
            'activityType',
            'strengthsAnalysis',
            'improvementsAnalysis',
            'details',
            'summary',
            'ACADEMIC_ACHIEVEMENT',
            'PERSONAL_DEVELOPMENT',
            'TEACHING_AND_ASSESSMENT',
            'LEARNING_ENVIRONMENT',
            'LEADERSHIP_AND_GOVERNANCE',
        ];

        const headers = this.columns.map(c => this.translate.instant(c.label));
        headers.splice(4, 0,
            this.translate.instant('PAGES.VISIT_FORM.LABELS.SUBJECT'),
            this.translate.instant('PAGES.VISIT_FORM.LABELS.ACTIVITY_TYPE')
        );
        this.excelExportService.exportToExcel(rows, LanguageUtil.isArabic ? 'الإستمارات' : 'Forms', fields, headers);
    }

    private getDomainLabelValue(domain: string, evals: any[]): any[] {
        return evals
            .filter(e => e.standard.domain === domain && e.notes?.trim() !== '')
            .map(e => (LanguageUtil.isArabic ? e.standard.titleAr : e.standard.titleEn) + ": " + e.notes);
    }
}