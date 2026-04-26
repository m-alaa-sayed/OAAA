import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewerRequestService} from '../services/external-reviewer-request.service';
import {RequestDto} from '../../user-tasks/model/request-dto';
import {ColumnFilterService} from '../../../shared/services/column-filter.service';
import {Permission} from "../../../core/enum/permission";

@Component({
    selector: 'external-reviewers-candidates',
    templateUrl: './external-reviewers-candidates.component.html',
    styleUrls: ['./external-reviewers-candidates.component.scss']
})
export class ExternalReviewerCandidatesComponent implements OnInit {
    module!: string;
    pageTitleKey = '';
    requestList: any[] = [];
    columns: any[] = [];
    actions: any[] = [];
    columnFilterOptions: { [key: string]: string[] } = {};

    constructor(
        private route: ActivatedRoute,
        private reviewerService: ExternalReviewerRequestService,
        private toastService: ToastService,
        public translate: TranslateService,
        private router: Router,
        private columnFilterService: ColumnFilterService
    ) {
        this.prepareGridColumns();
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.module = params.get('module')!;
            this.pageTitleKey = `PAGES.EXTERNAL_REVIEWERS_CANDIDATES.TITLES.${this.module}`;
            this.fetchRequests();
            this.loadStatusOptions();
        });
    }

    fetchRequests(): void {
        this.reviewerService.getApprovedRequests(this.module).subscribe({
            next: (res) => this.requestList = res.data || [],
            error: () =>
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING'), {
                    classname: 'bg-danger text-white',
                    autohide: false
                })
        });
    }

    openDetails(obj: any) {
        this.router.navigate(['/jawda/external-reviewers/external-reviewers-candidates-details/', obj.data.requestId]);
    }


    private prepareGridColumns(): void {
        this.columns = [
            {
                field: this.translate.currentLang === 'en' ? 'user.fullNameEn' : 'user.fullNameAr',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.FULL_NAME',
                valueGetter: (params: any) =>
                    this.translate.currentLang === 'en'
                        ? params.data.user?.fullNameEn ?? ''
                        : params.data.user?.fullNameAr ?? '',
                width: 200
            },
            {
                field: 'idType',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.ID_TYPE',
                valueGetter: (params: any) => {
                    const insideOman = params.data.user?.insideOman;
                    return insideOman
                        ? this.translate.instant('PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.INSIDE_OMAN')
                        : this.translate.instant('PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.OUTSIDE_OMAN');
                }
            },
            {
                field: 'idNumber',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.ID_NUMBER',
                valueGetter: (params: any) => {
                    const user = params.data.user;
                    if (!user) return '';
                    return user.insideOman ? user.civilNo ?? '' : user.passportNo ?? '';
                }
            },
            {
                field: 'user.nationality',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.NATIONALITY',
                valueGetter: (params: any) =>
                    this.translate.currentLang === 'en'
                        ? params.data.user?.nationality?.countryNameEn ?? ''
                        : params.data.user?.nationality?.countryNameAr ?? ''
            },
            {
                field: this.translate.currentLang === 'en' ? 'user.city.country.countryNameEn' : 'user.city.country.countryNameAr',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.RESIDENCY_COUNTRY',
                valueGetter: (params: any) =>
                    this.translate.currentLang === 'en'
                        ? params.data.user?.country?.countryNameEn ?? ''
                        : params.data.user?.country?.countryNameAr ?? ''
            },
            {
                field: this.translate.currentLang === 'en' ? 'user.city.cityNameEn' : 'user.city.cityNameAr',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.CITY',
                valueGetter: (params: any) => {
                    const user = params.data.user;
                    if (!user) return '';
                    return user.insideOman ? this.translate.currentLang === 'en'
                            ? params.data.user?.wilayat?.nameEn ?? ''
                            : params.data.user?.wilayat?.nameAr ?? '' :

                        this.translate.currentLang === 'en'
                            ? params.data.user?.city?.cityNameEn ?? ''
                            : params.data.user?.city?.cityNameAr ?? '';
                },
                cellStyle: {textAlign: 'center'}
            },
            {
                field: 'highestDegree',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.HIGHEST_DEGREE',
                valueGetter: (params: any) =>
                    this.translate.currentLang === 'en'
                        ? params.data.qualification?.degreeObtained?.lookupValueEn ?? ''
                        : params.data.qualification?.degreeObtained?.lookupValueAr ?? ''
            },
            {
                field: 'qualification',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.MAIN_SPECIALIZATION',
                valueGetter: (params: any) => {
                    const q = params.data.qualification;
                    const module = params.data.module;

                    if (module === 'CSEQA') {
                        const other = q?.otherCseqaGeneralSpecialization;
                        if (other) return other;

                        const general = q?.cseqaGeneralSpecialization;
                        return this.translate.currentLang === 'en' ? general?.nameEn ?? '' : general?.nameAr ?? '';
                    } else {
                        const other = q?.otherGeneralSpecialization;
                        if (other) return other;

                        const general = q?.specificSpecialization?.generalSpecialization;
                        return this.translate.currentLang === 'en' ? general?.nameEn ?? '' : general?.nameAr ?? '';
                    }
                }
            },
            {
                field: 'requestType',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.REQUEST_TYPE',
                valueGetter: (params: any) =>
                    this.translate.currentLang === 'en'
                        ? params.data.oaaaService?.serviceNameEn ?? ''
                        : params.data.oaaaService?.serviceNameAr ?? ''
            },
            {
                field: 'user.email',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.EMAIL',
                valueGetter: (params: any) => params.data.user?.email ?? ''
            },
            {
                field: 'user.mobileNo',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.MOBILE',
                valueGetter: (params: any) => params.data.user?.mobileNo ?? ''
            },
            {
                field: 'registrationStatus',
                headerName: 'PAGES.EXTERNAL_REVIEWERS_CANDIDATES.LABELS.STATUS',
                valueGetter: (params: any) => {
                    const status = params.data.registrationStatus;
                    if (this.module === 'CSEQA' && status === 'MET') {
                        return this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`);
                    }
                    return this.translate.instant(`PAGES.COMMON.LABELS.${status}`);
                }
            }
        ];

        this.actions = [
            {
                label: 'details',
                icon: 'ri-eye-fill',
                callback: (row: RequestDto) => this.openDetails(row)
            }
        ];
    }

    private loadStatusOptions(): void {
        // Use the shared service with API call for CSEQA module
        const apiCall = this.module === 'CSEQA' ? this.reviewerService.getStatusOptions() : undefined;

        this.columnFilterService.setupStatusFilterOptions(this.module, 'registrationStatus', apiCall)
            .subscribe(filterOptions => {
                this.columnFilterOptions = filterOptions;
            });
    }

   

   

    protected readonly Permission = Permission;
}
