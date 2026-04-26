import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardCseqaNationalityDistributionResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cseqa-nationality-distribution-card',
  templateUrl: './cseqa-nationality-distribution-card.component.html'
})
export class CseqaNationalityDistributionCardComponent implements OnInit {
  page = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50];
  sortDirection = 'DESC';

  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  colors = ['#1E88E5', '#10B981'];
  tableData: Array<{ nationalityName: string; local: number; international: number; total: number }> = [];
  isExporting = false;

  columns = [
    { field: 'nationalityName', headerName: 'الجنسية', cellStyle: { textAlign: 'center' } },
    { field: 'local', headerName: 'محلي',  cellStyle: { textAlign: 'center' } },
    { field: 'international', headerName: 'دولي',  cellStyle: { textAlign: 'center' } },
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private translate: TranslateService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.series = this.getDefaultSeries();
    this.load();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.load();
  }

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-cseqa-nationality-distribution-card',
        reportTitleKey: 'PAGES.DASHBOARD.CSEQA.LABELS.CARD_NATIONALITY_DISTRIBUTION',
        authorityTitleKey: 'MENUITEMS.MENU.CSEQA'
      });
    } finally {
      this.isExporting = false;
    }
  }

  async exportExcel(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cseqa-nationality-distribution-${new Date().toISOString().slice(0, 10)}`,
        headers: this.columns.map((column) => column.headerName),
        rows: this.tableData.map((row) => [row.nationalityName, row.local, row.international, row.total]),
        filters: [
          { label: 'Page', value: this.page + 1 },
          { label: 'Page Size', value: this.pageSize }
        ],
        sheetName: 'CSEQA Nationality Distribution'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private load(): void {
    this.dashboardService.getCseqaDistributionByNationality(this.page, this.pageSize, this.sortDirection).subscribe({
      next: (response: DashboardCseqaNationalityDistributionResponse) => {
        const rows = response?.rows ?? [];
        const isArabic = this.translate.currentLang  == 'ar'

        this.tableData = rows.map((item) => ({
          nationalityName: this.helper.getLocalizedValue(item.nationalityNameAr, item.nationalityNameEn),
          local: item.local,
          international: item.international,
          total: item.total
        }));

        this.categories = response?.chart?.categories ?? this.tableData.map((item) => item.nationalityName);
        this.series = response?.chart?.series?.length
          ? response.chart.series
          : [
            {
              name: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.LOCAL_REVIEWER'),
              data: this.tableData.map((item) => item.local)
            },
            {
              name: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_REVIEWER'),
              data: this.tableData.map((item) => item.international)
            }
          ];
      },
      error: () => {
        this.tableData = [];
        this.categories = [];
        this.series = this.getDefaultSeries();
      }
    });
  }

  private getDefaultSeries(): Array<{ name: string; data: number[] }> {
    return [
      { name: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.LOCAL_REVIEWER'), data: [] },
      { name: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_REVIEWER'), data: [] }
    ];
  }
}
