import { Component, OnInit } from '@angular/core';
import {
    ExternalReviewInterviewResultInfo
} from "../types/external-reviewers-interview-result/external-review-interview-result-info";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "../../../core/services/toast-service";
import { ActivatedRoute, Router } from "@angular/router";
import { ExternalReviewersInterviewResultService } from "../services/external-reviewers-interview-result.service";
import {
    ExternalReviewersInterviewResultInfoComponent
} from "./external-reviewers-interview-result-info/external-reviewers-interview-result-info.component";
import {
    ExternalReviewersInterviewRegistrationInfo
} from "../types/external-reviewers-interview-result/external-reviewers-interview-registration-info";
import { ColumnFilterService } from '../../../shared/services/column-filter.service';
import { ExternalReviewerRequestService } from '../services/external-reviewer-request.service';

@Component({
    selector: 'app-external-reviewers-interview-result',
    templateUrl: './external-reviewers-interview-result.component.html',
    styleUrl: './external-reviewers-interview-result.component.scss'
})
export class ExternalReviewersInterviewResultComponent implements OnInit {

    columns: any[] = [];
    actions: any[] = [];
    candidates: ExternalReviewersInterviewRegistrationInfo[] = [];
    columnFilterOptions: { [key: string]: string[] } = {};

    constructor(
        private interviewResultService: ExternalReviewersInterviewResultService,
        private modalService: NgbModal,
        public translate: TranslateService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router,
        private columnFilterService: ColumnFilterService,
        private externalReviewerRequestService: ExternalReviewerRequestService) {
    }

    ngOnInit(): void {
        this.getExternalReviewersInterviewResultsRegistration();
        this.prepareGrid();
    }

    getExternalReviewersInterviewResultsRegistration() {
        this.interviewResultService.getExternalReviewersInterviewResultsRegistration().subscribe({
            next: results => {
                this.candidates = results;
                // Create filter options from actual data for CSEQA records only
                this.createFilterOptionsFromData();
            }
        });
    }

    get isArabic() {
        return this.translate.currentLang === 'ar';
    }

    private prepareGrid() {
        this.columns = [
            {
                field: this.isArabic ? 'user.fullNameAr' : 'user.fullNameEn',
                headerName: 'PAGES.COMMON.LABELS.NAME'
            },
            {
                field: 'user.civilNo',
                headerName: 'PAGES.COMMON.LABELS.CIVIL_NUMBER'
            },
            {
                field: 'user.passportNo',
                headerName: 'PAGES.COMMON.LABELS.PASSPORT_NUMBER'
            },
            {
                field: this.isArabic ? 'user.city.country.countryNameAr' : 'user.city.country.countryNameEn',
                headerName: 'PAGES.COMMON.LABELS.COUNTRY_OF_RESIDENCE'
            },
            {
                headerName: 'PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.LABELS.MAIN_SPECIALIZATION',
                valueGetter: (params: any) => {
                    const q = params.data.qualification;
                    const module = params.data.module;

                    if (module === 'CSEQA') {
                        const other = q?.otherCseqaGeneralSpecialization;
                        if (other) return other;

                        const general = q?.cseqaGeneralSpecialization;
                        return this.isArabic ? general?.nameAr ?? '' : general?.nameEn ?? '';
                    } else {
                        const other = q?.otherGeneralSpecialization;
                        if (other) return other;

                        const general = q?.specificSpecialization?.generalSpecialization;
                        return this.isArabic ? general?.nameAr ?? '' : general?.nameEn ?? '';
                    }
                }
            },
            {
                field: 'requestType',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.LABELS.REQUEST_TYPE',
                valueFormatter: (params: any) =>
                    this.translate.instant('PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.LABELS.' + params.value),
                cellRenderer: null,
                cellStyle: { textAlign: 'center' }
            },
            {
                field: 'user.email',
                headerName: 'PAGES.COMMON.LABELS.EMAIL'
            },
            {
                field: 'user.mobileNo',
                headerName: 'PAGES.COMMON.LABELS.MOBILE'
            },
            {
                field: 'registrationStatus',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.LABELS.INTERVIEW_STATUS',
                valueGetter: (params: any) => {
                    const module = params.data.module;
                    const status = params.data.registrationStatus;
                    if (module === 'CSEQA' && status === 'MET') {
                        return this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`);
                    }
                    return this.translate.instant('PAGES.COMMON.LABELS.' + status);
                },
                cellRenderer: null,
                cellStyle: { textAlign: 'center' }
            }
        ];

        this.actions = [
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
                icon: 'ri-eye-line',
                callback: (row: any) => this.openExternalReviewersInterviewResultInfoComponent(row.data)
            }
        ];
    }


    private openExternalReviewersInterviewResultInfoComponent(dto: ExternalReviewInterviewResultInfo) {
        const modalRef = this.modalService.open(ExternalReviewersInterviewResultInfoComponent, {
            backdrop: 'static',
            keyboard: true,
            windowClass: 'width-800-96-modal with-backdrop'
        });
        modalRef.componentInstance.interviewRegistrationInfo = dto;
        modalRef.componentInstance.confirmEvent.subscribe(async (dto: ExternalReviewInterviewResultInfo) => {
            this.getExternalReviewersInterviewResultsRegistration();
        });
    }

    private createFilterOptionsFromData(): void {
        // Extract unique status values from CSEQA records only (since this component shows mixed data)
        const candidatesData = this.candidates as any[];
        const cseqaRecords = candidatesData.filter(candidate => candidate.module === 'CSEQA');
        
        if (cseqaRecords.length === 0) {
            this.columnFilterOptions = {};
            return;
        }

        const uniqueStatuses = [...new Set(
            cseqaRecords
                .map(item => item.registrationStatus)
                .filter(status => status) // Remove null/undefined values
        )];

        // Create translated filter options from actual data
        this.columnFilterOptions = {
            'registrationStatus': uniqueStatuses.map(status => {
                if (status === 'MET') {
                    return this.translate.instant('PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA');
                }
                return this.translate.instant('PAGES.COMMON.LABELS.' + status);
            })
        };
    }
}
