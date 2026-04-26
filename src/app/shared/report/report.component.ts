import {Component, OnInit} from '@angular/core';
import {BaseModal} from "../base-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../core/services/toast-service";
import {ReportService} from "./services/report.service";
import {ReportDto} from "./dto/report.dto";
import {LanguageUtil} from "../../core/util/language.util";

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class ReportComponent extends BaseModal implements OnInit {

    dtoList: ReportDto[] = [];
    columns: any[] = [];
    actions: any[] = [];
    module: string | null = null;

    constructor(modalService: NgbModal,
                public translate: TranslateService,
                public router: Router,
                public route: ActivatedRoute,
                public toastService: ToastService,
                public reportService: ReportService) {
        super(modalService);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.module = params.get('module');
            this.getReports();
            this.prepareGridHeaderCols();
        });
    }

    getReports() {
        this.reportService.getReports(this.module).subscribe({
            next: (res) => this.dtoList = res,
            error: (err) => this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), {
                classname: 'bg-danger text-white',
                autohide: false
            })
        });
    }

    private prepareGridHeaderCols() {
        this.columns = [
            {
                field: LanguageUtil.isArabic ? 'nameAr' : 'nameEn',
                headerName: 'PAGES.COMMON.LABELS.REPORT_NAME',
                width: 500
            }
        ];

        this.actions = [
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
                icon: 'ri-eye-fill',
                callback: (row: any) => this.openDeletePop(row.data)
            }
        ];
    }

    private openDeletePop(dto: ReportDto) {
        this.router.navigate([dto.frontendUrl], {
            state: {
                reportId: dto.id,
                reportCode: dto.reportCode,
                isReport: true,
                pageTitleAr: dto.nameAr,
                pageTitleEn: dto.nameEn
            }
        });
    }
}
